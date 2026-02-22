create extension if not exists "uuid-ossp";

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
    order_code text not null unique,
  user_id uuid not null references public.users(id) on delete cascade,
    phone_no text not null,
    shipping_address text not null,
    payment_method text not null,
    payment_status text not null default 'pending',
    order_status text not null default 'pending_payment',
    amount numeric(12,2) not null default 0,
    metadata jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint chk_orders_payment_method
    check (payment_method in ('cod', 'mock', 'momo_qr')),
  constraint chk_orders_payment_status
    check (payment_status in ('pending', 'paid', 'cod_pending')),
  constraint chk_orders_order_status
    check (order_status in ('pending_payment', 'confirmed', 'shipping', 'delivered', 'cancelled')),
  constraint chk_orders_amount_non_negative
    check (amount >= 0)
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
    order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
    product_name text not null,
    product_image text,
    unit_price numeric(12,2) not null default 0,
    qty int not null default 1,
    total_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),

  constraint chk_order_items_unit_price_non_negative
    check (unit_price >= 0),
  constraint chk_order_items_qty_positive
    check (qty > 0),
  constraint chk_order_items_total_price_non_negative
    check (total_price >= 0)
);

create index if not exists idx_orders_user_created_at on public.orders(user_id, created_at desc);
create index if not exists idx_orders_payment_status on public.orders(payment_status);
create index if not exists idx_orders_order_status on public.orders(order_status);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_orders_set_updated_at on public.orders;
create trigger trg_orders_set_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();
