-- ============================================================
-- Migração 002 — Artigos, alertas de odds e quiz diário
-- ============================================================

-- -------------------------
-- articles (notícias/análises geradas por IA ou admin)
-- -------------------------
create table if not exists public.articles (
  id            uuid default uuid_generate_v4() primary key,
  slug          text unique not null,
  title         text not null,
  summary       text,
  content       text not null,
  league        text,
  league_country text,
  game_id       text,
  tags          text[] default '{}',
  source        text default 'gemini' check (source in ('gemini','manual','rss')),
  published_at  timestamptz default now(),
  created_at    timestamptz default now()
);

alter table public.articles enable row level security;

create policy "Artigos públicos visíveis a todos"
  on public.articles for select using (true);

create policy "Admin insere artigos"
  on public.articles for insert with check (true);

create policy "Admin atualiza artigos"
  on public.articles for update using (true);

create index idx_articles_published_at on public.articles(published_at desc);
create index idx_articles_slug         on public.articles(slug);
create index idx_articles_league       on public.articles(league);

-- -------------------------
-- odds_alerts (alertas de variação de odds por usuário)
-- -------------------------
create table if not exists public.odds_alerts (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles on delete cascade not null,
  game_id       text not null,
  home_team     text not null,
  away_team     text not null,
  league        text not null,
  bookmaker     text not null,
  market        text not null,
  outcome       text not null,
  target_odds   numeric not null,
  current_odds  numeric,
  triggered     boolean not null default false,
  triggered_at  timestamptz,
  channel       text not null default 'push' check (channel in ('push','telegram','email')),
  created_at    timestamptz default now()
);

alter table public.odds_alerts enable row level security;

create policy "Usuário vê próprios alertas"
  on public.odds_alerts for select using (auth.uid() = user_id);

create policy "Usuário cria próprio alerta"
  on public.odds_alerts for insert with check (auth.uid() = user_id);

create policy "Usuário remove próprio alerta"
  on public.odds_alerts for delete using (auth.uid() = user_id);

create policy "Sistema atualiza alertas"
  on public.odds_alerts for update using (true);

create index idx_odds_alerts_user_id   on public.odds_alerts(user_id);
create index idx_odds_alerts_game_id   on public.odds_alerts(game_id);
create index idx_odds_alerts_triggered on public.odds_alerts(triggered) where triggered = false;

-- -------------------------
-- daily_quiz (quiz diário de apostas esportivas)
-- -------------------------
create table if not exists public.daily_quiz (
  id            uuid default uuid_generate_v4() primary key,
  quiz_date     date unique not null default current_date,
  question      text not null,
  options       jsonb not null,  -- [{label: 'A', text: '...'}]
  correct_index integer not null check (correct_index between 0 and 3),
  explanation   text,
  league        text,
  created_at    timestamptz default now()
);

alter table public.daily_quiz enable row level security;

create policy "Quiz público visível a todos"
  on public.daily_quiz for select using (true);

create policy "Sistema insere quiz"
  on public.daily_quiz for insert with check (true);

-- -------------------------
-- quiz_answers (respostas dos usuários ao quiz diário)
-- -------------------------
create table if not exists public.quiz_answers (
  user_id       uuid references public.profiles on delete cascade not null,
  quiz_id       uuid references public.daily_quiz on delete cascade not null,
  chosen_index  integer not null check (chosen_index between 0 and 3),
  is_correct    boolean not null,
  points_earned integer not null default 0,
  answered_at   timestamptz default now(),
  primary key (user_id, quiz_id)
);

alter table public.quiz_answers enable row level security;

create policy "Usuário vê próprias respostas"
  on public.quiz_answers for select using (auth.uid() = user_id);

create policy "Usuário responde quiz uma vez"
  on public.quiz_answers for insert with check (auth.uid() = user_id);
