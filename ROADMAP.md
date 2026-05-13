# ROADMAP.md — Plano de Implementação OddsBR

## Visão geral das fases

```
FASE 1 — MVP          semanas 1–4    Comparador de odds + home + auth
FASE 2 — Engajamento  semanas 5–8    Palpites + ranking + gamificação
FASE 3 — Retenção     semanas 9–12   Telegram + alertas + quiz
FASE 4 — Conteúdo     semanas 13–16  IA + SEO + notícias automáticas
FASE 5 — Monetização  semanas 17–20  Premium + value bets + calculadora
FASE 6 — Copa 2026    semanas 21–24  Bolão + funcionalidades especiais Copa
```

---

## FASE 1 — MVP (semanas 1–4)

**Objetivo**: Ter o comparador de odds funcionando e indexável pelo Google.

### Semana 1 — Setup e infraestrutura
- [ ] Criar projeto Next.js 15 com TypeScript e Tailwind CSS 4
- [ ] Configurar Supabase — criar projeto, schema inicial
- [ ] Configurar variáveis de ambiente (`.env.local` baseado em `.env.template`)
- [ ] Configurar ESLint, Prettier
- [ ] Deploy inicial na Vercel (domínio temporário)
- [ ] Criar conta na The Odds API e testar endpoint
- [ ] Criar conta na API-Football e testar endpoint
- [ ] Instalar e configurar shadcn/ui

### Semana 2 — Comparador de odds
- [ ] `src/lib/odds-api.ts` — cliente e tipos TypeScript para The Odds API
- [ ] `src/app/api/odds/route.ts` — proxy server-side (esconde API key)
- [ ] Componente `OddsTable` — tabela de odds por casa
- [ ] Componente `OddsCard` — card resumido de um jogo com top 3 odds
- [ ] Lógica de destaque: melhor odd de cada mercado fica verde
- [ ] Botão "Apostar" com link afiliado correto por casa
- [ ] `src/lib/affiliates.ts` — mapa de links afiliados por casa
- [ ] Filtros: por campeonato, por data

### Semana 3 — Home e páginas de jogo
- [ ] `app/(public)/page.tsx` — home com jogos do dia
- [ ] `app/(public)/jogos/[slug]/page.tsx` — página do jogo com odds completas
- [ ] `app/(public)/odds/page.tsx` — comparador completo
- [ ] `src/lib/football-api.ts` — cliente API-Football
- [ ] Integrar estatísticas de confronto na página do jogo
- [ ] Gerar `slug` de URL amigável: `flamengo-x-vasco-brasileirao-r20-2026`
- [ ] Metadata dinâmica (title, description, og:image) para SEO

### Semana 4 — Autenticação e perfil
- [ ] Configurar Supabase Auth (email + Google OAuth)
- [ ] `app/(auth)/login/page.tsx`
- [ ] `app/(auth)/cadastro/page.tsx`
- [ ] Middleware de proteção de rotas autenticadas
- [ ] `app/(dashboard)/perfil/page.tsx` — editar nome, time favorito
- [ ] Tabela `profiles` com trigger de criação automática pós-registro
- [ ] Footer global com aviso legal obrigatório (+18, responsabilidade)
- [ ] Testes básicos de fluxo completo

**Entregável fase 1**: Site indexável com comparador funcional, links afiliados ativos, cadastro de usuários.

---

## FASE 2 — Engajamento (semanas 5–8)

**Objetivo**: Criar razão para o usuário voltar todo dia.

### Semana 5 — Sistema de palpites
- [ ] Tabela `predictions` no Supabase (ver schema em CONTEXT.md)
- [ ] `src/actions/palpites.ts` — Server Actions: criar, listar, atualizar resultado
- [ ] Componente `PredictionForm` — modal de palpite em um jogo
- [ ] Validação: palpite só aceito até 5 min antes do jogo
- [ ] Webhook ou cron para calcular resultado após fim do jogo
- [ ] Sistema de pontuação conforme regras em CONTEXT.md

### Semana 6 — Feed e ranking
- [ ] `app/(public)/palpites/page.tsx` — feed público de palpites
- [ ] Componente `PredictionCard` — card com palpite, justificativa, resultado
- [ ] Curtir palpite (tabela `prediction_likes`)
- [ ] Seguir tipster (tabela `follows`)
- [ ] `app/(public)/ranking/page.tsx` — leaderboard
- [ ] Ranking semanal, mensal, geral com paginação

### Semana 7 — Perfis e conquistas
- [ ] `app/(public)/tipsters/[username]/page.tsx` — perfil público
- [ ] Estatísticas: total palpites, % acerto, pontos, sequência atual
- [ ] `src/lib/gamification.ts` — lógica de badges
- [ ] Verificação e atribuição de badges após cada palpite calculado
- [ ] Exibição de badges no perfil e nos cards de palpite

### Semana 8 — Card compartilhável
- [ ] `app/api/og/palpite/[id]/route.tsx` — gerar imagem OG com Next.js
- [ ] Design da imagem: palpite acertado, odd, pontos, logo do site
- [ ] Botão "Compartilhar" nos cards de palpites corretos
- [ ] Links de compartilhamento para WhatsApp, Instagram, Twitter/X

**Entregável fase 2**: Loop de engajamento completo. Usuário posta palpite, acompanha ranking, compartilha acertos.

---

## FASE 3 — Retenção (semanas 9–12)

**Objetivo**: Fazer o usuário abrir o site todo dia e trazer amigos.

### Semana 9 — Bot Telegram
- [ ] Criar bot no BotFather, obter token
- [ ] `src/lib/telegram.ts` — funções de envio de mensagem
- [ ] `app/api/webhook/telegram/route.ts` — webhook para receber comandos
- [ ] Comando `/start` — instruções de uso
- [ ] Comando `/conectar [email]` — vincula conta do site ao Telegram
- [ ] Comando `/times` — configurar times favoritos para alertas
- [ ] Tabela `telegram_connections` no Supabase

### Semana 10 — Alertas de odds
- [ ] Tabela `odds_alerts` — alertas configurados por usuário
- [ ] `app/(dashboard)/alertas/page.tsx` — UI para gerenciar alertas
- [ ] Script Python `scripts/alertas_odds.py` — monitora mudanças a cada 10 min
- [ ] Lógica: se odd muda > 0.10 em 1h, dispara alerta para usuários configurados
- [ ] Limite gratuito: 3 alertas/dia | Premium: ilimitado
- [ ] Canal público no Telegram para palpites do dia (post automático às 8h)

### Semana 11 — Quiz diário
- [ ] Tabela `daily_quiz` — perguntas e respostas do dia
- [ ] Script ou cron para gerar 5 perguntas com Gemini API às 0h
- [ ] `app/(public)/quiz/page.tsx` — interface do quiz
- [ ] Pontuação integrada ao sistema de palpites (+2 pts por acerto)
- [ ] Reset diário automático
- [ ] Compartilhar resultado do quiz (similar ao Wordle)

### Semana 12 — Agenda e notificações browser
- [ ] Lógica de "jogos favoritos" baseada em times do perfil
- [ ] Home personalizada para usuários logados (times favoritos primeiro)
- [ ] Push notifications via browser (Service Worker) — opt-in
- [ ] Notificação: jogo do time favorito começa em 2h

**Entregável fase 3**: Bot Telegram funcional, alertas de odds, quiz diário. Usuário tem razão de voltar todo dia.

---

## FASE 4 — Conteúdo e SEO (semanas 13–16)

**Objetivo**: Tráfego orgânico do Google escalar.

### Semana 13 — Pipeline de geração de artigos
- [ ] Script Python `scripts/gerar_conteudo.py`
- [ ] Fluxo: API-Football (jogos do dia) → Gemini (gera artigo) → POST na API do site
- [ ] `app/api/internal/articles/route.ts` — endpoint protegido por token interno
- [ ] Tabela `articles` no Supabase (ver schema em CONTEXT.md)
- [ ] `app/(public)/noticias/[slug]/page.tsx` — página de artigo
- [ ] ISR com revalidação a cada 1h
- [ ] Tag "[Gerado por IA]" obrigatória em todos os artigos

### Semana 14 — Scraping de notícias
- [ ] Script Python `scripts/buscar_noticias.py`
- [ ] Fontes RSS: Globo Esporte, ESPN Brasil, UOL Esporte
- [ ] Filtro: só notícias sobre lesões, escalações, suspensões (relevantes para apostas)
- [ ] Gemini sumariza com palavras próprias (nunca copia texto)
- [ ] Seção "Últimas" na home com 5 notícias mais recentes
- [ ] Cron: roda a cada 2h no VPS

### Semana 15 — Páginas SEO estáticas
- [ ] `app/(public)/guias/page.tsx` — listagem de guias
- [ ] Criar guias estáticos:
  - "Como comparar odds — guia completo"
  - "O que é value bet"
  - "Handicap asiático explicado"
  - "Melhores casas de apostas do Brasil 2026"
  - "Como funciona o Over/Under"
  - "Gestão de banca para apostas"
- [ ] Sitemap automático via `app/sitemap.ts`
- [ ] Robots.txt configurado
- [ ] Google Search Console — verificação e submissão do sitemap

### Semana 16 — SEO técnico
- [ ] Metadata dinâmica em todas as páginas de jogos
- [ ] Open Graph images dinâmicas para jogos (`/api/og/jogo/[id]`)
- [ ] Structured data (JSON-LD) nas páginas de jogos e artigos
- [ ] Verificar Core Web Vitals no PageSpeed Insights
- [ ] Implementar lazy loading de imagens
- [ ] Verificar que todas as páginas têm title e description únicos

**Entregável fase 4**: Site com conteúdo novo todo dia, crescendo organicamente no Google.

---

## FASE 5 — Monetização Premium (semanas 17–20)

**Objetivo**: Gerar receita recorrente além dos afiliados.

### Semana 17 — Detector de value bets
- [ ] `src/lib/value-bets.ts` — algoritmo de detecção
- [ ] Fórmula: calcular odd justa pela média ponderada das casas → comparar com cada casa
- [ ] Destaque visual de value bets positivos na tabela de odds
- [ ] Para usuários gratuitos: ver que existe um value bet mas não qual
- [ ] Para premium: ver qual casa, qual mercado, qual valor exato

### Semana 18 — Plano Premium
- [ ] Integrar Stripe (ou Pagar.me para Pix nativo)
- [ ] `app/(public)/premium/page.tsx` — landing page do plano
- [ ] Checkout: cartão de crédito + Pix
- [ ] `app/api/webhooks/stripe/route.ts` — atualiza `profiles.is_premium`
- [ ] Lógica de gates de feature em toda a aplicação
- [ ] Email de boas-vindas ao ativar premium
- [ ] Portal do cliente (cancelamento via Stripe Customer Portal)

### Semana 19 — Calculadora de banca
- [ ] `app/(public)/calculadora/page.tsx` — ferramenta pública
- [ ] Critério de Kelly: input banca + confiança → output valor sugerido
- [ ] Simulador de banca: visualizar crescimento/perda ao longo do tempo
- [ ] Histórico de apostas simuladas (paper trading) para usuários logados

### Semana 20 — Otimizações de conversão
- [ ] A/B test de CTAs nos links afiliados
- [ ] Banner de bônus de boas-vindas das casas (rotativo, com destaque para melhor bônus)
- [ ] Página dedicada "Melhores bônus de boas-vindas 2026" (alta conversão de afiliado)
- [ ] Email marketing: sequência de boas-vindas para novos cadastros (Brevo gratuito)
- [ ] Pixel de conversão para tracking dos programas de afiliados

**Entregável fase 5**: Receita recorrente de premium + otimização de conversão de afiliados.

---

## FASE 6 — Copa do Mundo 2026 (semanas 21–24)

**Objetivo**: Capturar o maior pico de tráfego do ano.

### Semana 21–22 — Bolão da Copa
- [ ] `app/(public)/copa-2026/page.tsx` — hub da Copa
- [ ] `app/(public)/copa-2026/bolao/page.tsx` — bolão de chaveamento
- [ ] Tabela `world_cup_brackets` — palpites de chaveamento completo
- [ ] Cálculo de pontos: acertar grupo (+1), oitavas (+2), quartas (+3), semis (+4), final (+5), campeão (+10)
- [ ] Ranking público do bolão
- [ ] Compartilhar bolão para grupo de amigos (link único)

### Semana 23–24 — Conteúdo especial Copa
- [ ] Páginas de cada seleção (estatísticas, elenco, odds de título)
- [ ] Comparador de odds Copa ao vivo durante os jogos
- [ ] Conteúdo diário gerado pela IA para cada partida
- [ ] Ranking de tipsters especial da Copa
- [ ] Push notifications para todos os jogos

---

## Métricas de sucesso por fase

| Fase | Métrica principal | Meta |
|------|-------------------|------|
| 1 | Páginas indexadas no Google | 50+ |
| 2 | Usuários cadastrados | 200+ |
| 3 | Usuários ativos semanais | 100+ |
| 4 | Visitas orgânicas/mês | 5.000+ |
| 5 | Receita mensal (afiliados + premium) | R$3.000+ |
| 6 | Pico de visitas/dia durante Copa | 10.000+ |

---

## Dependências e ordem crítica

```
Auth → Palpites (precisa de usuário logado)
Odds API → Comparador → Página de jogo → Artigo de palpite
Artigo de palpite → SEO → Tráfego orgânico
Usuários → Ranking → Gamificação → Retenção
Telegram → Alertas → Premium (gate de feature)
Stripe → Premium → Value bets (gate de feature)
```

---

## Custo operacional estimado

| Item | Custo mensal |
|------|--------------|
| Vercel (hobby) | R$0 |
| Supabase (free tier) | R$0 |
| The Odds API (básico) | ~R$130 |
| VPS para scripts Python (Hetzner CX11) | R$40 |
| Domínio .com.br | R$3 (R$40/ano) |
| Gemini API (free tier) | R$0 |
| Telegram Bot API | R$0 |
| **Total fase 1–3** | **~R$170/mês** |
| Stripe (só quando tiver receita) | 3,4% + R$0,90 por transação |
