import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import CalculadoraClient from './CalculadoraClient'

export const metadata: Metadata = {
  title: 'Calculadora de Banca — OddsBR',
  description:
    'Critério de Kelly para calcular o tamanho ideal da aposta. Simule o crescimento da sua banca e registre apostas simuladas (paper trading).',
}

export default async function CalculadoraPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <CalculadoraClient isLoggedIn={!!user} />
}
