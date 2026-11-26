-- ============================================================
-- Catalogo: restaurantes, platos y bucket de fotos de perfil
-- Correr completo en el SQL Editor de Supabase
-- ============================================================

create table restaurantes (
    id bigint generated always as identity primary key,
    nombre text not null,
    categoria text not null,  -- hoja del arbol de categorias: pizza, helados...
    zona text not null,       -- nodo del grafo de zonas de Cali
    descripcion text
);

create table platos (
    id bigint generated always as identity primary key,
    restaurante_id bigint references restaurantes(id) on delete cascade,
    nombre text not null,
    descripcion text,
    precio integer not null
);

-- el catalogo lo puede ver cualquiera, con o sin sesion
alter table restaurantes enable row level security;
alter table platos enable row level security;

create policy "ver restaurantes" on restaurantes
  for select to anon, authenticated using (true);

create policy "ver platos" on platos
  for select to anon, authenticated using (true);


-- ------------------------------------------------------------
-- Datos de prueba
-- ------------------------------------------------------------

insert into restaurantes (nombre, categoria, zona, descripcion) values
  ('La Hamburgueseria del Parque', 'hamburguesas', 'Oeste', 'Hamburguesas a la parrilla con pan artesanal'),
  ('Burger Patio', 'hamburguesas', 'Sur', 'Smash burgers y papas en casco'),
  ('Pizza Nostra', 'pizza', 'Norte', 'Pizza a la piedra estilo napolitano'),
  ('Horno de Granada', 'pizza', 'Norte', 'Pizzas y lasagnas al horno de lena'),
  ('Perros Donde Mono', 'perros', 'Oriente', 'Perros calientes con todo'),
  ('Fogon Vallecaucano', 'colombiana', 'Centro', 'Almuerzos y platos tipicos del Valle'),
  ('Sancocho de la Abuela', 'colombiana', 'Sur', 'Sancocho de gallina los fines de semana'),
  ('Empanadas del Pacifico', 'empanadas', 'Centro', 'Empanadas vallunas con aji de la casa'),
  ('Verde Bowl', 'bowls', 'Ciudad Jardin', 'Bowls de proteina y granos'),
  ('La Huerta', 'ensaladas', 'Pance', 'Ensaladas con productos de la region'),
  ('Helados Frescura', 'helados', 'Sur', 'Helados artesanales y malteadas'),
  ('Panaderia San Antonio', 'panaderia', 'Oeste', 'Pan de bono, pandebono y cafe');

insert into platos (restaurante_id, nombre, descripcion, precio) values
  ((select id from restaurantes where nombre = 'La Hamburgueseria del Parque'), 'Hamburguesa clasica', 'Carne de res, queso y vegetales', 22000),
  ((select id from restaurantes where nombre = 'La Hamburgueseria del Parque'), 'Hamburguesa doble', 'Doble carne y doble queso', 29000),
  ((select id from restaurantes where nombre = 'La Hamburgueseria del Parque'), 'Papas a la francesa', 'Porcion mediana', 8000),

  ((select id from restaurantes where nombre = 'Burger Patio'), 'Smash burger', 'Dos carnes delgadas con cebolla caramelizada', 26000),
  ((select id from restaurantes where nombre = 'Burger Patio'), 'Hamburguesa de pollo', 'Pollo apanado con salsa de la casa', 23000),
  ((select id from restaurantes where nombre = 'Burger Patio'), 'Papas en casco', 'Con paprika y salsa de ajo', 9000),

  ((select id from restaurantes where nombre = 'Pizza Nostra'), 'Pizza margarita', 'Tomate, mozzarella y albahaca', 32000),
  ((select id from restaurantes where nombre = 'Pizza Nostra'), 'Pizza pepperoni', 'Doble pepperoni', 36000),
  ((select id from restaurantes where nombre = 'Pizza Nostra'), 'Pizza hawaiana', 'Jamon y pina', 34000),

  ((select id from restaurantes where nombre = 'Horno de Granada'), 'Pizza de champinones', 'Champinones y queso parmesano', 35000),
  ((select id from restaurantes where nombre = 'Horno de Granada'), 'Lasagna boloñesa', 'Lasagna de carne gratinada', 30000),

  ((select id from restaurantes where nombre = 'Perros Donde Mono'), 'Perro sencillo', 'Salchicha, papitas y salsas', 12000),
  ((select id from restaurantes where nombre = 'Perros Donde Mono'), 'Perro especial', 'Con tocineta, queso y huevo de codorniz', 18000),
  ((select id from restaurantes where nombre = 'Perros Donde Mono'), 'Salchipapa', 'Salchicha y papas con queso', 15000),

  ((select id from restaurantes where nombre = 'Fogon Vallecaucano'), 'Arroz atollado', 'Con cerdo, pollo y chorizo', 24000),
  ((select id from restaurantes where nombre = 'Fogon Vallecaucano'), 'Bandeja paisa', 'Frijol, chicharron, huevo y arepa', 28000),
  ((select id from restaurantes where nombre = 'Fogon Vallecaucano'), 'Sopa de tortilla', 'Con aguacate y queso', 14000),

  ((select id from restaurantes where nombre = 'Sancocho de la Abuela'), 'Sancocho de gallina', 'Con arroz, aguacate y platano', 25000),
  ((select id from restaurantes where nombre = 'Sancocho de la Abuela'), 'Sancocho trifasico', 'Res, cerdo y pollo', 27000),

  ((select id from restaurantes where nombre = 'Empanadas del Pacifico'), 'Empanada de carne', 'Con aji de la casa', 3000),
  ((select id from restaurantes where nombre = 'Empanadas del Pacifico'), 'Empanada de pollo', 'Con aji de la casa', 3000),
  ((select id from restaurantes where nombre = 'Empanadas del Pacifico'), 'Combo 10 empanadas', 'Surtidas', 26000),

  ((select id from restaurantes where nombre = 'Verde Bowl'), 'Bowl de pollo', 'Pollo, quinoa, aguacate y maiz', 27000),
  ((select id from restaurantes where nombre = 'Verde Bowl'), 'Bowl de salmon', 'Salmon, arroz y edamame', 34000),

  ((select id from restaurantes where nombre = 'La Huerta'), 'Ensalada cesar', 'Pollo, crutones y parmesano', 21000),
  ((select id from restaurantes where nombre = 'La Huerta'), 'Ensalada de la huerta', 'Lechugas, tomate cherry y queso campesino', 18000),

  ((select id from restaurantes where nombre = 'Helados Frescura'), 'Helado de dos bolas', 'Sabores a eleccion', 9000),
  ((select id from restaurantes where nombre = 'Helados Frescura'), 'Malteada de chocolate', 'Con crema batida', 14000),
  ((select id from restaurantes where nombre = 'Helados Frescura'), 'Cholado', 'Hielo, frutas y lechera', 12000),

  ((select id from restaurantes where nombre = 'Panaderia San Antonio'), 'Pandebono', 'Recien horneado', 2500),
  ((select id from restaurantes where nombre = 'Panaderia San Antonio'), 'Pandebono con cafe', 'Combo de la manana', 6000),
  ((select id from restaurantes where nombre = 'Panaderia San Antonio'), 'Pan de yuca', 'Porcion de tres', 6500);


-- ------------------------------------------------------------
-- Fotos de perfil
-- Antes de esto, crear en Storage un bucket publico llamado avatars
-- ------------------------------------------------------------

create policy "subir a mi carpeta" on storage.objects
    for insert to authenticated
    with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "reemplazar mis archivos" on storage.objects
  for update to authenticated
  using ((storage.foldername(name))[1] = (select auth.uid())::text);

create policy "eliminar mis archivos" on storage.objects
  for delete to authenticated
  using (
      bucket_id = 'avatars'
      and (storage.foldername(name))[1] = (select auth.uid())::text
  );
