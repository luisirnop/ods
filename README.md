# OddsBR — Comparador de Odds & Comunidade de Palpites

Site brasileiro de comparação de odds em tempo real, palpites, rankings e conteúdo automatizado sobre futebol, com monetização via afiliados de casas de apostas licenciadas.

## Objetivo

Criar a plataforma de referência em português para apostadores estratégicos brasileiros, combinando:
- Comparador de odds em tempo real entre as principais casas de apostas
- Comunidade de palpiteiros com ranking e gamificação
- Conteúdo automático gerado por IA (palpites, análises, notícias)
- Alertas personalizados via Telegram
- Monetização via programas de afiliados (Betano, Superbet, KTO, Bet365)

## Stack Técnica

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Banco de dados**: Supabase (PostgreSQL)
- **Estilo**: Tailwind CSS 4 + shadcn/ui
- **Auth**: Supabase Auth
- **APIs externas**: The Odds API, API-Football, Gemini API, Telegram Bot API
- **Deploy**: Vercel
- **Automação**: Python (cron jobs em VPS separado)

## Estrutura de Pastas

```
src/
  app/
    (public)/           # Páginas públicas
      page.tsx          # Home — jogos do dia + odds em destaque
      odds/page.tsx     # Comparador completo de odds
      palpites/page.tsx # Feed público de palpites
      ranking/page.tsx  # Ranking de palpiteiros
      jogos/[id]/       # Página de jogo específico com odds
      noticias/         # Artigos gerados pela IA
      guias/            # Conteúdo educativo (SEO)
    (auth)/
      login/page.tsx
      cadastro/page.tsx
    (dashboard)/        # Área logada do usuário
      meus-palpites/
      alertas/
      perfil/
    api/
      odds/route.ts     # Proxy para The Odds API
      palpites/route.ts
      webhook/telegram/ # Webhook do bot Telegram
  components/
    odds/               # Tabela comparativa, card de odd
    palpites/           # Form de palpite, card, feed
    ranking/            # Leaderboard, avatar, badge
    jogos/              # Card de jogo, agenda
    ui/                 # Componentes base (shadcn)
  lib/
    odds-api.ts         # Cliente The Odds API
    football-api.ts     # Cliente API-Football
    supabase/
      client.ts
      server.ts
      admin.ts
    telegram.ts         # Bot e envio de alertas
    affiliates.ts       # Links e códigos de afiliados
    gamification.ts     # Pontuação, badges, conquistas
  actions/
    palpites.ts         # Server Actions de palpites
    alertas.ts          # Server Actions de alertas
    auth.ts             # Server Actions de auth
scripts/                # Python — rodam no VPS via cron
  gerar_conteudo.py     # Gemini gera artigos diários
  buscar_noticias.py    # RSS scraping de portais
  alertas_odds.py       # Monitor de mudanças de odds
```

## Scripts npm

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor após build |
| `npm run lint` | ESLint |

## Variáveis de Ambiente

Copie `.env.template` para `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
THE_ODDS_API_KEY=
API_FOOTBALL_KEY=
GEMINI_API_KEY=
TELEGRAM_BOT_TOKEN=
NEXT_PUBLIC_SITE_URL=https://oddsbr.com.br
```

## Monetização

- **Afiliados**: Links rastreados nas odds (CPA R$80–300 por cadastro)
- **Premium**: Plano R$29/mês com alertas ilimitados e análise avançada
- **AdSense**: Ativado após 10k visitas/mês

## Avisos Legais Obrigatórios

Todas as páginas devem exibir no footer:
- "Jogue com responsabilidade. Apostas são para maiores de 18 anos."
- "Este site contém links de afiliados. Consulte os termos de cada casa."
- Ícone +18 visível

## Documentação Complementar

- `CONTEXT.md` — contexto completo do negócio para a IA
- `ROADMAP.md` — fases e prioridades de implementação
- `.cursorrules` — regras para o Cursor/Claude Code
- `supabase/schema.sql` — schema completo do banco
