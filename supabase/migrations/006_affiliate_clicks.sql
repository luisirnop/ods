-- Rastreamento de cliques em links de afiliados
create table public.affiliate_clicks (
  id uuid default uuid_generate_v4() primary key,
  bookmaker text not null,
  source text not null,
  variant text,
  clicked_at timestamptz default now()
);

create index idx_affiliate_clicks_bookmaker on public.affiliate_clicks(bookmaker);
create index idx_affiliate_clicks_clicked_at on public.affiliate_clicks(clicked_at);

-- Permite insert anônimo (rastreamento público)
alter table public.affiliate_clicks enable row level security;
create policy "Qualquer um pode registrar clique" on public.affiliate_clicks
  for insert with check (true);
