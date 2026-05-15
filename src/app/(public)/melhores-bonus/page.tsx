import type { Metadata } from 'next'
import { BONUS_OFFERS } from '@/lib/bonuses'
import BonusTicker from '@/components/shared/BonusTicker'

export const metadata: Metadata = {
  title: 'Melhores Bônus de Apostas Esportivas 2026 — OddsBR',
  description:
    'Compare os melhores bônus de boas-vindas das casas de apostas licenciadas no Brasil em 2026. Betano, Bet365, KTO, Superbet e Estrela Bet com análise detalhada de rollover e condições.',
}

const FAQ = [
  {
    q: 'O que é rollover?',
    a: 'Rollover é a exigência de movimentar o valor do bônus um determinado número de vezes antes de poder sacar. Ex: bônus de R$100 com rollover 5x = você precisa apostar R$500 no total antes de sacar.',
  },
  {
    q: 'Qual é o melhor bônus de apostas do Brasil?',
    a: 'Depende do seu perfil. Para quem quer o maior valor absoluto: KTO (até R$1.000). Para quem quer o rollover mais fácil: Bet365 (apenas 1x). Para o equilíbrio entre valor e condições: Betano.',
  },
  {
    q: 'Os bônus são seguros?',
    a: 'Sim, desde que a casa seja regulamentada pela Secretaria de Prêmios e Apostas (SPA). Todas as casas nesta página operam legalmente no Brasil.',
  },
  {
    q: 'Posso pegar bônus em várias casas ao mesmo tempo?',
    a: 'Sim. Você pode criar contas e resgatar o bônus de boas-vindas em cada casa — cada uma é válida para a primeira aposta/depósito naquela plataforma.',
  },
]

export default function MelhoresBonusPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-block rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-600">
          Atualizado em 2026
        </div>
        <h1 className="text-3xl font-extrabold leading-snug">
          Melhores Bônus de Boas-Vindas para<br />
          <span className="text-green-500">Apostas Esportivas 2026</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl">
          Comparamos as principais casas de apostas licenciadas no Brasil e analisamos cada bônus de boas-vindas —
          valor máximo, depósito mínimo, rollover e as odds mínimas exigidas. Escolha o que faz mais sentido para
          o seu estilo de jogo.
        </p>
      </div>

      {/* Ticker horizontal */}
      <BonusTicker />

      {/* Cards detalhados */}
      <div className="space-y-4">
        {BONUS_OFFERS.map((offer, i) => (
          <div
            key={offer.bookmakerKey}
            className="rounded-xl border bg-card overflow-hidden flex flex-col sm:flex-row"
          >
            {/* Rank */}
            <div
              className="sm:w-16 flex items-center justify-center py-4 sm:py-0 text-2xl font-black text-muted-foreground/30"
            >
              #{i + 1}
            </div>

            {/* Info */}
            <div className="flex-1 px-5 py-5 space-y-2 border-t sm:border-t-0 sm:border-l">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-lg">{offer.name}</span>
                {offer.badge && (
                  <span className="rounded-full bg-amber-500/10 text-amber-600 text-[11px] font-bold px-2.5 py-0.5">
                    {offer.badge}
                  </span>
                )}
              </div>
              <p className="text-2xl font-extrabold text-green-600">{offer.bonus}</p>
              <p className="text-sm text-muted-foreground">{offer.bonusDetail}</p>

              <div className="flex flex-wrap gap-4 text-xs pt-1">
                <div>
                  <span className="text-muted-foreground">Depósito mínimo </span>
                  <span className="font-semibold">R${offer.minDeposit}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Rollover </span>
                  <span className="font-semibold">{offer.rolloverTimes}x</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Odds mínimas </span>
                  <span className="font-semibold">{offer.rolloverOdds.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-green-600 font-medium pt-0.5">✓ {offer.highlight}</p>
            </div>

            {/* CTA */}
            <div className="px-5 py-5 flex items-center justify-center sm:justify-end border-t sm:border-t-0 sm:border-l">
              <a
                href={`/api/click/${offer.bookmakerKey}?source=melhores-bonus&variant=a`}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="inline-flex items-center rounded-xl bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Resgatar bônus →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Como comparar */}
      <div className="rounded-xl border bg-muted/30 p-6 space-y-4">
        <h2 className="text-lg font-bold">Como comparar bônus de apostas</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <p className="font-semibold">1. Valor do bônus</p>
            <p className="text-muted-foreground">
              O maior nem sempre é o melhor. Um bônus de R$200 com rollover 1x vale mais do que R$1.000 com rollover 10x.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">2. Rollover</p>
            <p className="text-muted-foreground">
              Verifique quantas vezes você precisa movimentar o bônus e quais são as odds mínimas aceitas para o rollover.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">3. Mercados disponíveis</p>
            <p className="text-muted-foreground">
              Confirme se as apostas no seu esporte favorito contam para o rollover — algumas casas excluem mercados específicos.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-5">
        <h2 className="text-xl font-bold">Perguntas frequentes</h2>
        <div className="space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="border-b pb-4 space-y-1">
              <p className="font-semibold text-sm">{q}</p>
              <p className="text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-yellow-700 dark:text-yellow-400">Aviso importante</p>
        <p>
          As informações sobre bônus são meramente indicativas e podem mudar sem aviso prévio. Consulte sempre os Termos e
          Condições de cada casa antes de depositar. Apostas esportivas envolvem risco financeiro. Esta página contém
          links de afiliados — o OddsBR pode receber comissão pelos cliques, sem custo adicional para você. +18.
        </p>
      </div>
    </div>
  )
}
