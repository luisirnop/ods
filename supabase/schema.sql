-- supabase/schema.sql
-- Schema completo do OddsBR
-- Execute no SQL Editor do Supabase Dashboard

-- ================================================
-- EXTENSÕES
-- ================================================
create extension if not exists "uuid-ossp";

-- ================================================
-- PERFIS DE USUÁRIOS
-- Criado automaticamente via trigger após signup
-- ================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  display_name text,
  avatar_url text,
  favorite_team text,
  telegram_chat_id bigint unique,
  is_premium boolean default false,
  premium_until timestamptz,
  points_total int default 0,
  predictions_total int default 0,
  predictions_correct int default 0,
  current_streak int default 0,
  best_streak int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger: cria perfil automaticamente após cadastro
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ================================================
-- PALPITES
-- ================================================
create table public.predictions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  game_id text not null,
  home_team text not null,
  away_team text not null,
  league text not null,
  league_country text,
  game_date timestamptz not null,
  market text not null check (market in ('1x2', 'over_under', 'btts', 'exact_score', 'double_chance')),
  prediction text not null,
  confidence int check (confidence between 1 and 5),
  justification text,
  odds_at_time decimal(6,2),
  final_score_home int,
  final_score_away int,
  result text check (result in ('correct', 'incorrect', 'void')),
  points_earned int default 0,
  likes_count int default 0,
  comments_count int default 0,
  created_at timestamptz default now()
);

create index idx_predictions_user_id on public.predictions(user_id);
create index idx_predictions_game_id on public.predictions(game_id);
create index idx_predictions_game_date on public.predictions(game_date);
create index idx_predictions_result on public.predictions(result);

-- ================================================
-- HISTÓRICO DE ODDS (snapshots)
-- ================================================
create table public.odds_snapshots (
  id uuid default uuid_generate_v4() primary key,
  game_id text not null,
  home_team text not null,
  away_team text not null,
  league text not null,
  game_date timestamptz not null,
  bookmaker text not null,
  market text not null,
  home_odd decimal(6,2),
  draw_odd decimal(6,2),
  away_odd decimal(6,2),
  over_25_odd decimal(6,2),
  under_25_odd decimal(6,2),
  btts_yes_odd decimal(6,2),
  btts_no_odd decimal(6,2),
  captured_at timestamptz default now()
);

create index idx_odds_game_id on public.odds_snapshots(game_id);
create index idx_odds_captured_at on public.odds_snapshots(captured_at);
create index idx_odds_bookmaker on public.odds_snapshots(bookmaker);

-- ================================================
-- ALERTAS DE ODDS CONFIGURADOS PELO USUÁRIO
-- ================================================
create table public.odds_alerts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  team_name text,
  league text,
  bookmaker text,
  market text,
  threshold decimal(4,2) default 0.10,
  is_active boolean default true,
  alerts_sent_today int default 0,
  last_alert_at timestamptz,
  created_at timestamptz default now()
);

create index idx_alerts_user_id on public.odds_alerts(user_id);

-- ================================================
-- ARTIGOS GERADOS PELA IA
-- ================================================
create table public.articles (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  meta_description text,
  content text not null,
  game_id text,
  home_team text,
  away_team text,
  league text,
  game_date date,
  article_type text check (article_type in ('prediction', 'news', 'guide', 'recap')) default 'prediction',
  generated_by text default 'gemini-1.5-flash',
  source_url text,
  published boolean default true,
  views int default 0,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

create index idx_articles_slug on public.articles(slug);
create index idx_articles_game_date on public.articles(game_date);
create index idx_articles_published_at on public.articles(published_at);
create index idx_articles_league on public.articles(league);

-- ================================================
-- CONQUISTAS / BADGES
-- ================================================
create table public.achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  badge_key text not null,
  unlocked_at timestamptz default now(),
  unique (user_id, badge_key)
);

create index idx_achievements_user_id on public.achievements(user_id);

-- ================================================
-- SEGUIDORES (tipsters)
-- ================================================
create table public.follows (
  follower_id uuid references public.profiles on delete cascade not null,
  following_id uuid references public.profiles on delete cascade not null,
  created_at timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

-- ================================================
-- CURTIDAS EM PALPITES
-- ================================================
create table public.prediction_likes (
  user_id uuid references public.profiles on delete cascade not null,
  prediction_id uuid references public.predictions on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, prediction_id)
);

-- Trigger: atualiza contador de likes
create or replace function update_likes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update public.predictions set likes_count = likes_count + 1 where id = NEW.prediction_id;
  elsif TG_OP = 'DELETE' then
    update public.predictions set likes_count = likes_count - 1 where id = OLD.prediction_id;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger on_like_change
  after insert or delete on public.prediction_likes
  for each row execute procedure update_likes_count();

-- ================================================
-- QUIZ DIÁRIO
-- ================================================
create table public.daily_quiz (
  id uuid default uuid_generate_v4() primary key,
  quiz_date date unique not null,
  questions jsonb not null,
  created_at timestamptz default now()
);

create table public.quiz_answers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  quiz_date date not null,
  answers jsonb not null,
  correct_count int not null,
  points_earned int not null,
  answered_at timestamptz default now(),
  unique (user_id, quiz_date)
);

-- ================================================
-- BOLÃO DA COPA 2026
-- ================================================
create table public.world_cup_brackets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  bracket_name text,
  predictions jsonb not null,
  champion text,
  runner_up text,
  total_points int default 0,
  share_token text unique default encode(gen_random_bytes(8), 'hex'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Profiles: público para leitura, privado para escrita
alter table public.profiles enable row level security;
create policy "Perfis públicos para leitura" on public.profiles for select using (true);
create policy "Usuário edita próprio perfil" on public.profiles for update using (auth.uid() = id);

-- Predictions: público para leitura, autenticado para escrita
alter table public.predictions enable row level security;
create policy "Palpites públicos para leitura" on public.predictions for select using (true);
create policy "Usuário cria próprio palpite" on public.predictions for insert with check (auth.uid() = user_id);
create policy "Usuário edita próprio palpite" on public.predictions for update using (auth.uid() = user_id);

-- Odds snapshots: público para leitura
alter table public.odds_snapshots enable row level security;
create policy "Odds públicas para leitura" on public.odds_snapshots for select using (true);

-- Alertas: privado por usuário
alter table public.odds_alerts enable row level security;
create policy "Usuário vê próprios alertas" on public.odds_alerts for select using (auth.uid() = user_id);
create policy "Usuário cria próprios alertas" on public.odds_alerts for insert with check (auth.uid() = user_id);
create policy "Usuário edita próprios alertas" on public.odds_alerts for update using (auth.uid() = user_id);
create policy "Usuário deleta próprios alertas" on public.odds_alerts for delete using (auth.uid() = user_id);

-- Artigos: público para leitura
alter table public.articles enable row level security;
create policy "Artigos públicos para leitura" on public.articles for select using (published = true);

-- Achievements: público para leitura
alter table public.achievements enable row level security;
create policy "Conquistas públicas para leitura" on public.achievements for select using (true);

-- Follows: público para leitura, autenticado para escrita
alter table public.follows enable row level security;
create policy "Seguidores públicos para leitura" on public.follows for select using (true);
create policy "Usuário segue outros" on public.follows for insert with check (auth.uid() = follower_id);
create policy "Usuário deixa de seguir" on public.follows for delete using (auth.uid() = follower_id);

-- Likes: público para leitura, autenticado para escrita
alter table public.prediction_likes enable row level security;
create policy "Likes públicos para leitura" on public.prediction_likes for select using (true);
create policy "Usuário curte palpites" on public.prediction_likes for insert with check (auth.uid() = user_id);
create policy "Usuário remove curtida" on public.prediction_likes for delete using (auth.uid() = user_id);

-- Quiz: público para leitura
alter table public.daily_quiz enable row level security;
create policy "Quiz público para leitura" on public.daily_quiz for select using (true);

-- Quiz answers: privado por usuário
alter table public.quiz_answers enable row level security;
create policy "Usuário vê próprias respostas" on public.quiz_answers for select using (auth.uid() = user_id);
create policy "Usuário responde quiz" on public.quiz_answers for insert with check (auth.uid() = user_id);

-- Bolão: público para leitura (via share_token), privado para escrita
alter table public.world_cup_brackets enable row level security;
create policy "Bolão público via share_token" on public.world_cup_brackets for select using (true);
create policy "Usuário cria próprio bolão" on public.world_cup_brackets for insert with check (auth.uid() = user_id);
create policy "Usuário edita próprio bolão" on public.world_cup_brackets for update using (auth.uid() = user_id);
