-- Adiciona coluna para vincular perfil ao cliente Stripe
alter table public.profiles
  add column if not exists stripe_customer_id text unique;
