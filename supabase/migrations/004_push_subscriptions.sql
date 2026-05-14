-- Migration: push_subscriptions
-- Executar no Supabase SQL Editor

create table if not exists public.push_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  endpoint text not null,
  subscription jsonb not null,
  created_at timestamptz default now(),
  unique(user_id, endpoint)
);

alter table public.push_subscriptions enable row level security;

create policy "Usuário vê próprias subscriptions"
  on public.push_subscriptions for select using (auth.uid() = user_id);

create policy "Usuário insere subscription"
  on public.push_subscriptions for insert with check (auth.uid() = user_id);

create policy "Usuário exclui subscription"
  on public.push_subscriptions for delete using (auth.uid() = user_id);
