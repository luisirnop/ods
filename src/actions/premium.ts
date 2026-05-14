'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oddsbr.com.br'

export async function createCheckoutSession(): Promise<never> {
  const stripe = getStripe()
  if (!stripe) redirect('/premium?erro=stripe-nao-configurado')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/premium')

  const priceId = process.env.STRIPE_PRICE_ID
  if (!priceId) redirect('/premium?erro=preco-nao-configurado')

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id, display_name')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id ?? null

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: profile?.display_name ?? undefined,
      metadata: { supabase_id: user.id },
    })
    customerId = customer.id
    await admin
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${SITE_URL}/premium/sucesso?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/premium`,
    subscription_data: {
      metadata: { supabase_id: user.id },
    },
  })

  redirect(session.url!)
}

export async function createPortalSession(): Promise<never> {
  const stripe = getStripe()
  if (!stripe) redirect('/perfil?erro=stripe-nao-configurado')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) redirect('/perfil?erro=sem-assinatura')

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${SITE_URL}/perfil`,
  })

  redirect(session.url!)
}
