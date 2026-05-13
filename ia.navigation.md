# ia.navigation.md — Mapa de Arquivos para Agentes de IA

Este arquivo ajuda agentes de IA (Claude Code, Cursor, Copilot) a navegar o projeto rapidamente.

## Leitura obrigatória antes de qualquer task

| Arquivo | O que contém |
|---------|-------------|
| `CONTEXT.md` | Regras de negócio, banco de dados, APIs, compliance |
| `ROADMAP.md` | Fases, prioridades, o que implementar primeiro |
| `.cursorrules` | Convenções de código, o que fazer e não fazer |
| `supabase/schema.sql` | Schema completo do banco de dados |

## Onde fica cada coisa

### Lógica de negócio
- Odds e comparador → `src/lib/odds-api.ts`
- Dados de futebol → `src/lib/football-api.ts`
- Links afiliados → `src/lib/affiliates.ts`
- Pontos e badges → `src/lib/gamification.ts`
- Telegram → `src/lib/telegram.ts`
- Supabase cliente (browser) → `src/lib/supabase/client.ts`
- Supabase servidor → `src/lib/supabase/server.ts`
- Supabase admin → `src/lib/supabase/admin.ts`

### Server Actions (mutações)
- Palpites → `src/actions/palpites.ts`
- Alertas → `src/actions/alertas.ts`
- Auth → `src/actions/auth.ts`
- Premium → `src/actions/premium.ts`

### Páginas principais
- Home (jogos do dia) → `src/app/(public)/page.tsx`
- Comparador de odds → `src/app/(public)/odds/page.tsx`
- Jogo específico → `src/app/(public)/jogos/[slug]/page.tsx`
- Feed de palpites → `src/app/(public)/palpites/page.tsx`
- Ranking → `src/app/(public)/ranking/page.tsx`
- Artigos/notícias → `src/app/(public)/noticias/[slug]/page.tsx`
- Guias SEO → `src/app/(public)/guias/[slug]/page.tsx`
- Login → `src/app/(auth)/login/page.tsx`
- Cadastro → `src/app/(auth)/cadastro/page.tsx`
- Perfil do usuário → `src/app/(dashboard)/perfil/page.tsx`
- Alertas do usuário → `src/app/(dashboard)/alertas/page.tsx`
- Meus palpites → `src/app/(dashboard)/meus-palpites/page.tsx`
- Premium → `src/app/(public)/premium/page.tsx`

### API Routes
- Proxy de odds → `src/app/api/odds/route.ts`
- Webhook Telegram → `src/app/api/webhook/telegram/route.ts`
- Webhook Stripe → `src/app/api/webhooks/stripe/route.ts`
- OG image palpite → `src/app/api/og/palpite/[id]/route.tsx`
- OG image jogo → `src/app/api/og/jogo/[id]/route.tsx`
- API interna (scripts Python) → `src/app/api/internal/articles/route.ts`

### Scripts Python (rodam no VPS)
- Gerar artigos com IA → `scripts/gerar_conteudo.py`
- Buscar notícias RSS → `scripts/buscar_noticias.py`
- Monitorar e alertar odds → `scripts/alertas_odds.py`

### Componentes por domínio
- Tabela de odds → `src/components/odds/OddsTable.tsx`
- Card de odd → `src/components/odds/OddsCard.tsx`
- Form de palpite → `src/components/predictions/PredictionForm.tsx`
- Card de palpite → `src/components/predictions/PredictionCard.tsx`
- Feed de palpites → `src/components/predictions/PredictionFeed.tsx`
- Leaderboard → `src/components/ranking/Leaderboard.tsx`
- Card de tipster → `src/components/ranking/TipsterCard.tsx`
- Badge → `src/components/ranking/Badge.tsx`
- Card de jogo → `src/components/games/GameCard.tsx`
- Header → `src/components/shared/Header.tsx`
- Footer (com aviso legal) → `src/components/shared/Footer.tsx`

## Invariantes críticas — NUNCA violar

1. **Links afiliados**: sempre via `getAffiliateLink()`, nunca hardcoded
2. **SUPABASE_SERVICE_ROLE_KEY**: nunca no browser, nunca em componentes client
3. **Footer com aviso legal**: obrigatório em todas as páginas públicas
4. **RLS ativo**: todas as tabelas têm Row Level Security
5. **Palpites têm prazo**: só aceitos até 5 min antes do jogo
6. **Conteúdo IA marcado**: todo artigo gerado tem tag `[Gerado por IA]`
7. **Nunca prometer lucro**: linguagem de apostas responsável sempre

## Padrão de error handling em Server Actions

```typescript
// Sempre retornar objeto com success ou error — nunca throw
export async function minhaAction(data: FormData) {
  try {
    // validação...
    // operação...
    revalidatePath('/pagina')
    return { success: true }
  } catch (error) {
    console.error('Erro em minhaAction:', error)
    return { error: 'Mensagem amigável para o usuário' }
  }
}
```

## Padrão de página com dados externos

```typescript
// app/(public)/pagina/page.tsx
import { Suspense } from 'react'
import { PaginaSkeleton } from '@/components/shared/Skeletons'

export async function generateMetadata() {
  return {
    title: 'Título | OddsBR',
    description: 'Descrição para SEO'
  }
}

export default async function Pagina() {
  return (
    <main>
      <Suspense fallback={<PaginaSkeleton />}>
        <ConteudoAsync />
      </Suspense>
    </main>
  )
}

async function ConteudoAsync() {
  const data = await fetchData() // fetch no servidor
  return <Componente data={data} />
}
```
