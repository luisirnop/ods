# CONTEXT.md — Contexto Completo do Projeto OddsBR

## O que é este projeto

**OddsBR** é um site brasileiro de comparação de odds em tempo real, comunidade de palpites e conteúdo automatizado sobre futebol. O objetivo central é monetizar via programas de afiliados de casas de apostas licenciadas no Brasil (Betano, Superbet, KTO, Bet365, Estrela Bet).

O site NÃO opera apostas. NÃO recebe dinheiro de usuários para apostas. É um site de conteúdo e ferramentas que direciona usuários para casas de apostas parceiras através de links rastreados.

---

## Público-alvo

**Perfil primário**: Homens 22–45 anos, apostadores estratégicos brasileiros que já apostam ou querem começar. Pesquisam antes de apostar, comparam odds, buscam análises e value bets. Usam celular principalmente.

**Perfil secundário**: Torcedores de futebol curiosos sobre apostas, que chegam pelo conteúdo de palpites e podem converter para apostadores.

**Comportamento típico**: Acessa antes de um jogo importante, compara odds entre casas, lê o palpite, clica no link da casa com melhor odd, se cadastra (gerando comissão).

---

## Modelo de negócio detalhado

### Fonte 1 — Afiliados (principal)
Cada casa de apostas parceira fornece links rastreados. Quando um usuário clica no link e se cadastra + faz primeiro depósito, o site recebe:
- **CPA** (Cost Per Acquisition): R$80–R$300 por usuário
- **Revenue Share**: 25–40% do lucro líquido da casa com aquele usuário, recorrente

Programas prioritários:
1. Betano Affiliates — maior conversão no Brasil
2. Superbet Affiliates — aprovação rápida
3. KTO Affiliates — boas odds, programa sólido
4. Bet365 Affiliates — RevShare atrativo
5. Estrela Bet — CPA alto

### Fonte 2 — Plano Premium (R$29/mês)
Recursos exclusivos para assinantes:
- Alertas de odds via Telegram ilimitados (gratuito = 3/dia)
- Detector de value bets com IA
- Ver palpites dos top tipsters antes do jogo
- Estatísticas avançadas de desempenho
- Sem anúncios

### Fonte 3 — Google AdSense
Ativado quando tráfego atingir 10k visitas/mês. Receita estimada: R$300–800/mês adicional.

---

## Funcionalidades — ordem de prioridade

### FASE 1 — MVP (semanas 1–4)

#### 1.1 Comparador de odds em tempo real
- Fonte: The Odds API (https://the-odds-api.com)
- Exibe odds de 15+ casas brasileiras lado a lado para cada jogo
- Mercados: 1X2 (resultado), Over/Under 2.5, Ambos Marcam, Handicap
- Atualiza a cada 10 minutos via revalidação
- Destaque visual para a melhor odd de cada mercado
- Botão "Apostar" = link afiliado da casa correspondente
- Filtros: por campeonato, por data, por mercado

#### 1.2 Página de jogo individual
- URL: `/jogos/[id]` (ex: `/jogos/flamengo-x-vasco-brasileirao-2026`)
- Tabela completa de odds de todas as casas
- Estatísticas do confronto (via API-Football)
- Artigo de palpite gerado pela IA (Gemini)
- Call to action para melhor odd com link afiliado

#### 1.3 Home — jogos do dia
- Lista de jogos do dia com odds em destaque
- Filtro por campeonato (Brasileirão Série A, B, Copa do Brasil, Libertadores, Premier League, Champions League)
- Card de cada jogo mostra: times, horário, odds 1X2 das 3 melhores casas
- Banner de bônus das casas parceiras (afiliado)

#### 1.4 Autenticação de usuários
- Cadastro com email/senha via Supabase Auth
- Login com Google (OAuth)
- Perfil básico: nome, time do coração, foto

### FASE 2 — Engajamento (semanas 5–8)

#### 2.1 Sistema de palpites
- Usuário logado pode publicar palpite em qualquer jogo
- Campos: resultado esperado, mercado escolhido, justificativa (opcional), confiança (1–5 estrelas)
- Após o jogo: resultado calculado automaticamente, pontos atribuídos
- Sistema de pontuação:
  - Resultado correto: +10 pts
  - Mercado exato (ex: Over 2.5): +15 pts
  - Placar exato: +30 pts
  - Bônus de sequência (3 acertos seguidos): +5 pts

#### 2.2 Ranking de palpiteiros
- Ranking semanal, mensal e geral
- Exibe: posição, avatar, nome, acertos/total, % acerto, pontos
- Badge especial para top 3 da semana
- Página de perfil público de cada tipster

#### 2.3 Feed público de palpites
- Timeline com palpites recentes de todos os usuários
- Filtros: por campeonato, por jogo, por tipsters seguidos
- Curtir, comentar, seguir tipster
- Ordenação: mais recentes / mais curtidos / melhores tipsters

#### 2.4 Sistema de conquistas (badges)
Badges desbloqueáveis:
- "Primeiro Palpite" — ao postar o primeiro palpite
- "Bola de Cristal" — 5 acertos seguidos
- "Analistão" — 50 palpites postados
- "Tipster da Semana" — top 3 no ranking semanal
- "Value Hunter" — 3 value bets corretas

#### 2.5 Card compartilhável
- Após acertar um palpite, gerar imagem OG (Next.js `og` API)
- Imagem com: nome do usuário, palpite acertado, odds, logo do site
- Botão "Compartilhar no WhatsApp / Instagram"
- URL: `/api/og/palpite/[id]`

### FASE 3 — Notificações e Retenção (semanas 9–12)

#### 3.1 Bot de alertas no Telegram
- Usuário conecta conta ao bot: `/conectar [email]`
- Escolhe times/campeonatos favoritos
- Recebe alerta quando:
  - Odd de time favorito muda mais de 0.10 em 1h
  - Value bet detectada (odd acima do valor justo)
  - Jogo começa em 2h (lembrete)
- Gratuito: 3 alertas/dia | Premium: ilimitado
- Canal público do site no Telegram para palpites diários

#### 3.2 Agenda personalizada
- Usuário escolhe times favoritos no perfil
- Home mostra primeiro os jogos dos times favoritos
- Notificação browser (push) opcional

#### 3.3 Quiz diário
- 5 perguntas geradas pela Gemini API sobre futebol
- Temas: jogos do dia, história, estatísticas, regras
- Pontuação integrada ao sistema de ranking (+2 pts por acerto)
- Reset diário à meia-noite

### FASE 4 — Conteúdo Automático e SEO (semanas 13–16)

#### 4.1 Pipeline de geração de conteúdo (Python + Gemini)
Script que roda via cron às 6h todo dia:
1. Busca jogos do dia via API-Football
2. Para cada jogo: coleta estatísticas, histórico, escalação provável
3. Gemini gera artigo de palpite (600–800 palavras) em pt-BR
4. Publica via API do Next.js (rota protegida por token)
5. Gera meta description e title SEO otimizados

#### 4.2 Scraping de notícias
Script Python que roda a cada 2h:
1. Lê RSS do Globo Esporte, ESPN Brasil, UOL Esporte, GE
2. Filtra notícias sobre lesões, escalações, suspensões
3. Sumariza com Gemini (nunca copia texto — cria novo)
4. Publica na seção "Notícias" com link para fonte original

#### 4.3 Páginas de guias (SEO de cauda longa)
Páginas estáticas criadas uma vez e atualizadas mensalmente:
- "Como funciona o handicap asiático"
- "O que é value bet e como encontrar"
- "Melhores casas de apostas do Brasil [ano]"
- "Como comparar odds — guia completo"
- "O que é Over/Under nas apostas"

#### 4.4 Bolão da Copa 2026
- Funcionalidade especial para Copa do Mundo 2026
- Usuário preenche chaveamento completo
- Ranking de quem acertar mais resultados
- Compartilhamento do bolão para grupos de amigos
- Maior pico de tráfego do ano — lançar 1 mês antes

### FASE 5 — Monetização Premium (semanas 17–20)

#### 5.1 Detector de value bets
- Calcula "odd justa" usando probabilidade implícita das odds de mercado
- Compara com odds de cada casa
- Destaca quando uma casa paga mais que o valor justo
- Fórmula: `valor = (odd_casa × probabilidade_implicita) - 1`
- Resultado > 0 = value bet positivo

#### 5.2 Plano Premium
- Checkout via Stripe (cartão) + Pix (manual ou Stripe)
- Cancelamento fácil pela interface
- Webhook Stripe atualiza `profiles.is_premium` no Supabase

#### 5.3 Calculadora de banca
- Usuário informa banca total e confiança no palpite
- Sugere valor a apostar pelo Critério de Kelly
- Histórico de apostas simuladas (paper trading)

---

## Banco de dados — tabelas principais

```sql
-- Perfis de usuários
profiles (
  id uuid references auth.users,
  username text unique,
  display_name text,
  avatar_url text,
  favorite_team text,
  telegram_chat_id bigint,
  is_premium boolean default false,
  premium_until timestamptz,
  points_total int default 0,
  created_at timestamptz
)

-- Palpites
predictions (
  id uuid,
  user_id uuid references profiles,
  game_id text,           -- ID da API-Football
  home_team text,
  away_team text,
  league text,
  game_date timestamptz,
  market text,            -- '1x2', 'over_under', 'btts', 'exact_score'
  prediction text,        -- '1', 'X', '2', 'over', 'under', 'sim', 'nao', '2-1'
  confidence int,         -- 1-5
  justification text,
  odds_at_time decimal,   -- Odd no momento do palpite
  result text,            -- 'correct', 'incorrect', 'void', null (pendente)
  points_earned int,
  likes_count int default 0,
  created_at timestamptz
)

-- Odds snapshot (histórico)
odds_snapshots (
  id uuid,
  game_id text,
  bookmaker text,
  market text,
  home_odd decimal,
  draw_odd decimal,
  away_odd decimal,
  captured_at timestamptz
)

-- Alertas de odds configurados pelo usuário
odds_alerts (
  id uuid,
  user_id uuid references profiles,
  team_name text,
  league text,
  threshold decimal,      -- Alertar se odd mudar mais que X
  is_active boolean,
  created_at timestamptz
)

-- Artigos gerados pela IA
articles (
  id uuid,
  slug text unique,
  title text,
  meta_description text,
  content text,
  game_id text,
  home_team text,
  away_team text,
  league text,
  game_date date,
  generated_by text,      -- 'gemini-1.5-flash'
  published_at timestamptz,
  views int default 0
)

-- Conquistas desbloqueadas
achievements (
  id uuid,
  user_id uuid references profiles,
  badge_key text,         -- 'first_prediction', 'five_streak', etc.
  unlocked_at timestamptz
)

-- Seguidores (tipsters)
follows (
  follower_id uuid references profiles,
  following_id uuid references profiles,
  created_at timestamptz,
  primary key (follower_id, following_id)
)

-- Curtidas em palpites
prediction_likes (
  user_id uuid references profiles,
  prediction_id uuid references predictions,
  created_at timestamptz,
  primary key (user_id, prediction_id)
)
```

---

## APIs e integrações

### The Odds API
- **Base URL**: `https://api.the-odds-api.com/v4`
- **Endpoints usados**:
  - `GET /sports` — lista de esportes
  - `GET /sports/{sport}/odds` — odds ao vivo por esporte
  - `GET /sports/{sport}/scores` — placares ao vivo
- **Regiões**: `br` (casas brasileiras), `eu` (casas europeias)
- **Mercados**: `h2h` (1X2), `totals` (over/under), `btts`
- **Rate limit**: 500 req/mês (gratuito) → 10.000/mês (US$25/mês)

### API-Football (RapidAPI)
- **Base URL**: `https://api-football-v1.p.rapidapi.com/v3`
- **Endpoints usados**:
  - `GET /fixtures` — jogos por data/liga
  - `GET /fixtures/statistics` — estatísticas do jogo
  - `GET /fixtures/headtohead` — histórico de confrontos
  - `GET /players` — escalações e informações de jogadores
- **Rate limit**: 100 req/dia (gratuito)

### Gemini API (Google)
- **Modelo**: `gemini-1.5-flash` (gratuito)
- **Uso**: geração de artigos de palpite, quiz, sumarização de notícias
- **Rate limit gratuito**: 1.500 req/dia, 1M tokens/min

### Telegram Bot API
- **Gratuito, sem limite de mensagens**
- **Webhook**: recebe mensagens dos usuários
- **sendMessage**: envia alertas proativos

---

## Regras de negócio

### Afiliados
- Todo botão "Apostar" ou "Ver odd" deve ter o parâmetro de afiliado correto
- Links de afiliados ficam em `src/lib/affiliates.ts`
- Nunca hardcodar links — sempre via a função `getAffiliateLink(bookmaker, page)`
- Páginas de "melhores casas" devem listar apenas casas com programa de afiliados ativo

### Compliance e responsabilidade
- Footer de todas as páginas: "Jogue com responsabilidade. +18. Apostas envolvem risco."
- Não usar linguagem que prometa lucro ("ganhe dinheiro", "lucre sempre")
- Usar linguagem que promova consciência ("aposte com estratégia", "compare antes de apostar")
- Nenhum conteúdo direcionado a menores de 18 anos

### Pontuação de palpites
- Palpites só são válidos se postados até 5 minutos antes do jogo
- Resultado calculado automaticamente após fim do jogo via webhook da API-Football
- Palpites anulados em caso de jogo cancelado ou adiado

### Conteúdo gerado por IA
- Todo artigo gerado deve ter tag `[Gerado por IA]` visível
- Nunca copiar texto de outras fontes — Gemini gera conteúdo original
- Revisar prompt para evitar alucinações sobre estatísticas

---

## Identidade visual

- **Nome**: OddsBR (pode ser ajustado)
- **Tom**: profissional mas acessível, linguagem de torcedor estratégico
- **Cores primárias**: verde (sucesso/odd positiva) + vermelho (odd negativa/derrota) + fundo escuro
- **Tipografia**: moderna, legível em mobile
- **Ícone**: comparação/gráfico relacionado a futebol ou odds

---

## Performance e SEO

- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, FID < 100ms
- **SSR nas páginas de odds**: dados frescos para SEO e usuário
- **ISR nas páginas de artigos**: revalidação a cada 1h
- **Sitemap automático**: gerado pelo Next.js para todos os artigos e jogos
- **Open Graph**: imagem gerada dinamicamente para cada jogo (via `/api/og`)
- **Robots.txt**: permitir indexação de tudo exceto área logada e API

---

## Contexto da Copa do Mundo 2026

A Copa do Mundo 2026 acontece em junho/julho de 2026, com 104 jogos (recorde histórico). É o maior evento de tráfego do ano para o nicho. O site deve estar funcionando e com autoridade no Google pelo menos 3 meses antes. Funcionalidade de bolão da Copa deve ser lançada 4–6 semanas antes do início.
