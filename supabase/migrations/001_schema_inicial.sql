-- ============================================================
-- Migração 001 — Schema inicial OddsBR
-- Executar no Supabase SQL Editor (em ordem)
-- ============================================================

-- -------------------------
-- profiles (criado por trigger no signup)
-- -------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  username      text unique,
  display_name  text,
  avatar_url    text,
  favorite_team text,
  telegram_chat_id bigint unique,
  is_premium    boolean not null default false,
  premium_until timestamptz,
  points_total  integer not null default 0,
  predictions_total   integer not null default 0,
  predictions_correct integer not null default 0,
  current_streak      integer not null default 0,
  best_streak         integer not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Perfil público visível a todos"
  on public.profiles for select using (true);

create policy "Usuário edita próprio perfil"
  on public.profiles for update using (auth.uid() = id);

-- Trigger: cria profile automaticamente ao criar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -------------------------
-- predictions (palpites)
-- -------------------------
create table if not exists public.predictions (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references public.profiles on delete cascade not null,
  game_id       text not null,
  home_team     text not null,
  away_team     text not null,
  league        text not null,
  league_country text,
  game_date     timestamptz not null,
  market        text not null check (market in ('1x2','over_under','btts','exact_score','double_chance')),
  prediction    text not null,
  confidence    integer not null check (confidence between 1 and 5),
  justification text,
  odds_at_time  numeric,
  final_score_home integer,
  final_score_away integer,
  result        text check (result in ('correct','incorrect','void')),
  points_earned integer not null default 0,
  likes_count   integer not null default 0,
  comments_count integer not null default 0,
  created_at    timestamptz default now()
);

alter table public.predictions enable row level security;

create policy "Palpites públicos visíveis a todos"
  on public.predictions for select using (true);

create policy "Usuário insere próprio palpite"
  on public.predictions for insert with check (auth.uid() = user_id);

create policy "Usuário atualiza próprio palpite"
  on public.predictions for update using (auth.uid() = user_id);

create index idx_predictions_user_id    on public.predictions(user_id);
create index idx_predictions_game_id    on public.predictions(game_id);
create index idx_predictions_created_at on public.predictions(created_at desc);
create index idx_predictions_result     on public.predictions(result);

-- Trigger: mantém likes_count desnormalizado
create or replace function public.update_prediction_likes_count()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.predictions set likes_count = likes_count + 1 where id = new.prediction_id;
  elsif TG_OP = 'DELETE' then
    update public.predictions set likes_count = greatest(0, likes_count - 1) where id = old.prediction_id;
  end if;
  return null;
end;
$$;

-- -------------------------
-- prediction_likes
-- -------------------------
create table if not exists public.prediction_likes (
  prediction_id uuid references public.predictions on delete cascade not null,
  user_id       uuid references public.profiles on delete cascade not null,
  created_at    timestamptz default now(),
  primary key (prediction_id, user_id)
);

alter table public.prediction_likes enable row level security;

create policy "Likes públicos visíveis"
  on public.prediction_likes for select using (true);

create policy "Usuário curtiu/descurtiu"
  on public.prediction_likes for insert with check (auth.uid() = user_id);

create policy "Usuário remove próprio like"
  on public.prediction_likes for delete using (auth.uid() = user_id);

create or replace trigger on_like_change
  after insert or delete on public.prediction_likes
  for each row execute procedure public.update_prediction_likes_count();

-- -------------------------
-- follows (seguir tipsters)
-- -------------------------
create table if not exists public.follows (
  follower_id   uuid references public.profiles on delete cascade not null,
  following_id  uuid references public.profiles on delete cascade not null,
  created_at    timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

alter table public.follows enable row level security;

create policy "Follows públicos visíveis"
  on public.follows for select using (true);

create policy "Usuário segue/deixa de seguir"
  on public.follows for insert with check (auth.uid() = follower_id);

create policy "Usuário remove próprio follow"
  on public.follows for delete using (auth.uid() = follower_id);

-- -------------------------
-- achievements (conquistas/badges)
-- -------------------------
create table if not exists public.achievements (
  id         uuid default uuid_generate_v4() primary key,
  user_id    uuid references public.profiles on delete cascade not null,
  badge_id   text not null,
  earned_at  timestamptz default now(),
  unique (user_id, badge_id)
);

alter table public.achievements enable row level security;

create policy "Conquistas públicas visíveis"
  on public.achievements for select using (true);

create policy "Sistema insere conquistas"
  on public.achievements for insert with check (true);
