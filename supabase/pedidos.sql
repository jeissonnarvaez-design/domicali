-- ============================================================
-- Pedidos y chat
-- Correr despues de catalogo.sql (pedidos referencia a restaurantes)
-- ============================================================

create table pedidos (
    id bigint generated always as identity primary key,
    user_id uuid references auth.users default auth.uid(),
    correo text,
    restaurante_id bigint references restaurantes(id),
    restaurante text not null,
    zona_origen text not null,
    zona_entrega text not null,
    direccion text not null,
    items jsonb not null,
    total integer not null,
    estado text default 'pendiente',
    created_at timestamptz default now()
);

create table mensajes (
    id bigint generated always as identity primary key,
    pedido_id bigint references pedidos(id) on delete cascade,
    user_id uuid references auth.users default auth.uid(),
    autor text not null,
    texto text not null,
    created_at timestamptz default now()
);

alter table pedidos enable row level security;
alter table mensajes enable row level security;

-- la cocina y el ranking de lo mas pedido necesitan ver todos los pedidos,
-- por eso cualquier usuario con sesion puede leerlos
create policy "ver pedidos" on pedidos
  for select to authenticated using (true);

-- pero cada quien solo puede crear pedidos a su nombre
create policy "crear mis pedidos" on pedidos
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- la cocina pasa el pedido a en_camino y el cliente lo marca como entregado
create policy "cambiar estado" on pedidos
  for update to authenticated using (true);

create policy "ver mensajes" on mensajes
  for select to authenticated using (true);

create policy "enviar mis mensajes" on mensajes
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- tiempo real para el chat, la cola de la cocina y el estado del pedido
alter publication supabase_realtime add table pedidos;
alter publication supabase_realtime add table mensajes;
