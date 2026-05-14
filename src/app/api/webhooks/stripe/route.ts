import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getAdminClient } from '@/lib/supabase/admin'
import { getStripe } from '@/lib/stripe'
import { sendWelcomeEmail } from '@/lib/email'

// Stripe v22 removeu current_period_end do Subscription.
// Usamos now() + 31 dias como aproximação do ciclo mensal.
function nextMonthIso(): string {
  return new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString()
}

export async function POST(request: Request) {
  const stripe = getStripe()
  if (!stripe) return new Response('Stripe not configured', { status: 503 })

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !webhookSecret) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return new Response('Webhook signature verification failed', { status: 400 })
  }

  const admin = getAdminClient()

  async function profileByCustomer(customerId: string) {
    const { data } = await admin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()
    return data
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break

      const profile = await profileByCustomer(session.customer as string)
      if (!profile) break

      await admin
        .from('profiles')
        .update({ is_premium: true, premium_until: nextMonthIso() })
        .eq('id', profile.id)

      if (session.customer_email) {
        const { data: fullProfile } = await admin
          .from('profiles')
          .select('display_name')
          .eq('id', profile.id)
          .single()
        await sendWelcomeEmail(
          session.customer_email,
          fullProfile?.display_name ?? 'Usuário'
        )
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const profile = await profileByCustomer(sub.customer as string)
      if (!profile) break

      const isActive = sub.status === 'active' || sub.status === 'trialing'
      await admin
        .from('profiles')
        .update({
          is_premium: isActive,
          premium_until: isActive ? nextMonthIso() : null,
        })
        .eq('id', profile.id)
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const profile = await profileByCustomer(sub.customer as string)
      if (!profile) break

      await admin
        .from('profiles')
        .update({ is_premium: false, premium_until: null })
        .eq('id', profile.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
