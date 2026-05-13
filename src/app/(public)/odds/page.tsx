import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Comparador de Odds',
  description:
    'Compare odds de futebol em tempo real entre as principais casas de apostas do Brasil.',
}

export default function OddsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Comparador de Odds</h1>
      <p className="text-muted-foreground">
        Compare odds de todas as casas de apostas lado a lado.
      </p>
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        Comparador em desenvolvimento. Configure a chave da The Odds API.
      </div>
    </div>
  )
}
