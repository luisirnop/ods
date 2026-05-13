import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Palpites',
  description: 'Veja os palpites da comunidade OddsBR para os jogos de hoje.',
}

export default function PalpitesPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Feed de Palpites</h1>
      <p className="text-muted-foreground">
        Palpites da comunidade para os jogos de hoje.
      </p>
      <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
        Configure o Supabase para visualizar e publicar palpites.
      </div>
    </div>
  )
}
