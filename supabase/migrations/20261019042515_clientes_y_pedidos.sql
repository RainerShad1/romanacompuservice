-- Esquema privado para funciones auxiliares (no expuesto por la API)
create schema if not exists private;
grant usage on schema private to authenticated, anon;

-- Valida cédula dominicana: 11 dígitos + dígito verificador (Luhn con pesos 1,2,1,2…)
create or replace function private.cedula_valida(c text)
returns boolean language plpgsql immutable set search_path = '' as $$
declare s int := 0; p int; i int;
begin
  if c is null or c !~ '^[0-9]{11}$' then return false; end if;
  for i in 1..10 loop
    p := substr(c, i, 1)::int * (case when i % 2 = 1 then 1 else 2 end);
    if p > 9 then p := p - 9; end if;
    s := s + p;
  end loop;
  return (10 - s % 10) % 10 = substr(c, 11, 1)::int;
end $$;

-- Perfil del cliente
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  cedula text not null unique check (private.cedula_valida(cedula)),
  nombre text not null check (char_length(nombre) between 3 and 120),
  telefono text not null check (telefono ~ '^[0-9]{10,15}$'),
  direccion text check (char_length(direccion) <= 300),
  sector text check (char_length(sector) <= 120),
  referencia text check (char_length(referencia) <= 300),
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  created_at timestamptz not null default now()
);

-- Administradores de la tienda
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function private.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
grant execute on function private.is_admin() to authenticated;

-- Pedidos
create table public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  envio numeric(12,2) not null default 0 check (envio >= 0),
  total numeric(12,2) not null check (total >= 0),
  entrega text not null check (entrega in ('delivery', 'retiro')),
  direccion text check (char_length(direccion) <= 600),
  lat double precision,
  lng double precision,
  pago text check (char_length(pago) <= 60),
  nota text check (char_length(nota) <= 500),
  created_at timestamptz not null default now()
);
create index orders_user_id_idx on public.orders(user_id);

-- Seguridad por filas
alter table public.profiles enable row level security;
alter table public.admins enable row level security;
alter table public.orders enable row level security;

create policy "Ver mi perfil o admin" on public.profiles for select to authenticated
  using ((select auth.uid()) = id or (select private.is_admin()));
create policy "Editar mi perfil" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Saber si soy admin" on public.admins for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Crear mis pedidos" on public.orders for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Ver mis pedidos o admin" on public.orders for select to authenticated
  using ((select auth.uid()) = user_id or (select private.is_admin()));

-- El cliente no puede cambiar su cédula ni su id; solo datos de contacto y ubicación
revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (nombre, telefono, direccion, sector, referencia, lat, lng) on public.profiles to authenticated;
revoke all on public.admins from anon;
grant select on public.admins to authenticated;
revoke all on public.orders from anon;
revoke update, delete on public.orders from authenticated;
grant select, insert on public.orders to authenticated;
