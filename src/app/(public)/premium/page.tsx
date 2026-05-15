import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutSession, createPortalSession } from '@/actions/premium'

export const metadata: Metadata = {
  title: 'Premium — OddsBR',
  description:
    'Acesse value bets, alertas ilimitados e muito mais. Assine o OddsBR Premium por R$29,90/mês.',
}

const FREE_FEATURES = [
  'Comparador de odds em tempo real',
  'Palpites da comunidade',
  'Quiz diário (+2 pts por acerto)',
  'Ranking e conquistas',
  'Alertas de odds (3/dia)',
  'Bot Telegram básico',
  'Indicador "Value bet detectado"',
]

const PREMIUM_FEATURES = [
  'Tudo do plano gratuito',
  '⚡ Value bets completos — casa, mercado e % de edge',
  '🔔 Alertas de odds ilimitados pelo Telegram',
  '📊 Histórico completo de odds e movimentações',
  '🏆 Badge exclusivo de Premium no perfil',
  '🚀 Acesso antecipado a novos recursos',
]

export default async function PremiumPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isPremium = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_premium, premium_until')
      .eq('id', user.id)
      .single()
    isPremium = profile?.is_premium ?? false
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-block rounded-full bg-green-500/10 border border-green-500/30 px-4 py-1.5 text-sm font-semibold text-green-600">
          OddsBR Premium
        </div>
        <h1 className="text-4xl font-extrabold leading-tight">
          Aposte com mais <span className="text-green-500">informação</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Veja onde estão os value bets, configure alertas sem limite e tenha
          vantagem sobre a banca.
        </p>
      </div>

      {/* Planos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gratuito */}
        <div className="rounded-2xl border bg-card p-6 space-y-5">
          <div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Gratuito
            </div>
            <div className="text-3xl font-extrabold">R$0</div>
            <div className="text-sm text-muted-foreground">para sempre</div>
          </div>

          <ul className="space-y-2.5 text-sm">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <div className="w-full rounded-xl border px-4 py-2.5 text-center text-sm font-medium text-muted-foreground">
              Plano atual
            </div>
          </div>
        </div>

        {/* Premium */}
        <div className="rounded-2xl border-2 border-green-500 bg-card p-6 space-y-5 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="rounded-full bg-green-500 text-white text-xs font-bold px-3 py-1">
              MAIS POPULAR
            </span>
          </div>

          <div>
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Premium
            </div>
            <div className="flex items-end gap-1">
              <span className="text-3xl font-extrabold">R$29,90</span>
              <span className="text-muted-foreground mb-1">/mês</span>
            </div>
            <div className="text-sm text-muted-foreground">cancele quando quiser</div>
          </div>

          <ul className="space-y-2.5 text-sm">
            {PREMIUM_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2">
            {isPremium ? (
              <form action={createPortalSession}>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-muted hover:bg-muted/80 px-4 py-2.5 text-sm font-semibold transition-colors"
                >
                  Gerenciar assinatura →
                </button>
              </form>
            ) : (
              <form action={createCheckoutSession}>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-green-500 hover:bg-green-600 text-black px-4 py-2.5 text-sm font-semibold transition-colors"
                >
                  {user ? 'Assinar agora →' : 'Criar conta e assinar →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-center">Perguntas frequentes</h2>
        <div className="space-y-4 text-sm">
          {[
            {
              q: 'O que é um value bet?',
              a: 'É quando uma casa de apostas oferece uma odd maior do que a probabilidade real do evento. A longo prazo, apostar em value bets consistentemente gera lucro.',
            },
            {
              q: 'Posso cancelar a qualquer momento?',
              a: 'Sim. Clique em "Gerenciar assinatura" no seu perfil para acessar o portal do cliente e cancelar quando quiser. O acesso dura até o fim do período pago.',
            },
            {
              q: 'Quais formas de pagamento são aceitas?',
              a: 'Cartão de crédito via Stripe. Pix em breve.',
            },
            {
              q: 'Os value bets garantem lucro?',
              a: 'Não. Value bets identificam oportunidades com edge positivo, mas resultados individuais são aleatórios. Gestão de banca responsável é essencial.',
            },
          ].map(({ q, a }) => (
            <div key={q} className="space-y-1 border-b pb-4">
              <p className="font-semibold">{q}</p>
              <p className="text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Aviso legal */}
      <p className="text-center text-xs text-muted-foreground">
        Apostas esportivas envolvem risco financeiro. Jogue com responsabilidade. +18.
        O OddsBR não é uma casa de apostas e não recebe apostas.
      </p>
    </div>
  )
}
