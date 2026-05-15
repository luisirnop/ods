-- ============================================================
-- Migração 003 — Copa do Mundo 2026 e snapshots de odds
-- ============================================================

-- -------------------------
-- world_cup_brackets (bolão da Copa 2026)
-- -------------------------
create table if not exists public.world_cup_brackets (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references public.profiles on delete cascade not null,
  bracket_name    text not null default 'Meu Bolão',
  -- Fase de grupos: {group_a: {1st: 'BRA', 2nd: 'ARG'}, ...}
  group_picks     jsonb not null default '{}',
  -- Fase eliminatória: {r16: [...], qf: [...], sf: [...], final: '...', champion: '...'}
  knockout_picks  jsonb not null default '{}',
  champion        text,
  runner_up       text,
  third_place     text,
  top_scorer      text,
  points_total    integer not null default 0,
  is_public       boolean not null default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),
  unique (user_id, bracket_name)
);

alter table public.world_cup_brackets enable row level security;

create policy "Bolões públicos visíveis"
  on public.world_cup_brackets for select using (is_public = true or auth.uid() = user_id);

create policy "Usuário cria próprio bolão"
  on public.world_cup_brackets for insert with check (auth.uid() = user_id);

create policy "Usuário atualiza próprio bolão"
  on public.world_cup_brackets for update using (auth.uid() = user_id);

create policy "Usuário deleta próprio bolão"
  on public.world_cup_brackets for delete using (auth.uid() = user_id);

create index idx_brackets_user_id    on public.world_cup_brackets(user_id);
create index idx_brackets_points     on public.world_cup_brackets(points_total desc);

-- -------------------------
-- odds_snapshots (histórico de odds para gráficos de tendência)
-- -------------------------
create table if not exists public.odds_snapshots (
  id            bigserial primary key,
  game_id       text not null,
  sport         text not null,
  home_team     text not null,
  away_team     text not null,
  bookmaker     text not null,
  market        text not null,
  outcome       text not null,
  price         numeric not null,
  captured_at   timestamptz default now()
);

alter table public.odds_snapshots enable row level security;

create policy "Snapshots públicos visíveis"
  on public.odds_snapshots for select using (true);

create policy "Sistema insere snapshots"
  on public.odds_snapshots for insert with check (true);

create index idx_snapshots_game_id     on public.odds_snapshots(game_id);
create index idx_snapshots_captured_at on public.odds_snapshots(captured_at desc);
create index idx_snapshots_bookmaker   on public.odds_snapshots(bookmaker);

-- Retém apenas 30 dias de snapshots (cron job ou pg_cron)
-- delete from public.odds_snapshots where captured_at < now() - interval '30 days';
