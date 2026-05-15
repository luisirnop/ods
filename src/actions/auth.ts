'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

const SignUpSchema = LoginSchema.extend({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
})

export async function login(_prevState: unknown, formData: FormData) {
  const parsed = LoginSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) return { error: { _form: [error.message] } }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(_prevState: unknown, formData: FormData) {
  const parsed = SignUpSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.name } },
  })

  if (error) return { error: { _form: [error.message] } }

  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

const ResetSchema = z.object({
  email: z.string().email('Email inválido'),
})

export async function requestPasswordReset(_prevState: unknown, formData: FormData) {
  const parsed = ResetSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/redefinir-senha`,
  })

  if (error) return { error: { _form: [error.message] } }
  return { success: true }
}

const NewPasswordSchema = z.object({
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: 'As senhas não coincidem',
  path: ['confirm'],
})

export async function updatePassword(_prevState: unknown, formData: FormData) {
  const parsed = NewPasswordSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password })

  if (error) return { error: { _form: [error.message] } }

  revalidatePath('/', 'layout')
  redirect('/')
}
