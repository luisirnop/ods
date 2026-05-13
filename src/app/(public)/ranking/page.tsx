import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ranking de Palpiteiros',
  description: 'Veja o ranking semanal, mensal e geral dos melhores palpiteiros do OddsBR.',
}

export default function RankingPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Ranking de Palpiteiros</h1>
      <p className="text-muted-foreground">
        Os melhores tipsters da semana, mês e geral.
      </p>
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        Configure o Supabase para visualizar o ranking.
      </div>
    </div>
  )
}
