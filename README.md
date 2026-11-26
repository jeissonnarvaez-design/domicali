# DomiCali

Plataforma de domicilios para Cali. Los usuarios buscan restaurantes por categoría o por plato,
arman su carrito, confirman el pedido a su zona y lo siguen en un mapa mientras hablan con el
repartidor por chat. Del otro lado, la cocina atiende los pedidos en orden de llegada.

Proyecto final de Estructuras de Datos II - Universidad Autónoma de Occidente.

## Integrantes

| Nombre | Rama | Aporte |
| --- | --- | --- |
| Jeisson Narváez Preciado | `jeisson-pedidos` | Base del proyecto, login y registro, pedidos, cocina, mapa de zonas y chat |
| Sebastián Ocampo Ospina | `sebastian-catalogo`, `sebastian-documentacion` | Catálogo, buscador, carrito, perfil y documentación |

## Enlaces

- Propuesta gráfica (Figma): _pegar aquí el enlace_
- Aplicación desplegada (Netlify): _pegar aquí el enlace_
- Documento final: [docs/documento-final.md](docs/documento-final.md)

## Tecnologías

- Angular 21 (componentes standalone, signals, router con guards y lazy loading)
- Supabase (autenticación, base de datos Postgres con RLS, realtime y storage)
- SASS
- Netlify para el despliegue

## Estructuras de datos

| Estructura | Dónde se usa | Archivo |
| --- | --- | --- |
| Lista enlazada | Carrito de compras | `src/app/estructuras/lista-enlazada.ts` |
| Cola | Pedidos pendientes en la cocina | `src/app/estructuras/cola.ts` |
| Árbol | Categorías de restaurantes | `src/app/estructuras/arbol.ts` |
| Trie | Buscador de platos | `src/app/estructuras/trie.ts` |
| Heap | Platos más pedidos | `src/app/estructuras/heap.ts` |
| Grafo | Zonas de Cali y ruta de entrega | `src/app/estructuras/grafo.ts` |

El porqué de cada una está explicado en el [documento final](docs/documento-final.md).

## Correr el proyecto

```
npm install
ng serve
```

Queda en http://localhost:4200.

## Configurar Supabase

1. Crear un proyecto en https://supabase.com (región São Paulo).
2. Copiar la Project URL y la publishable key en `src/environments/environment.ts` y en
   `src/environments/environment.development.ts`.
3. Authentication → Sign In / Providers: dejar Email habilitado y apagar *Confirm email*.
4. Storage: crear un bucket **público** llamado `avatars`.
5. SQL Editor: correr `supabase/catalogo.sql` y después `supabase/pedidos.sql`.
6. Authentication → URL Configuration: poner la URL de Netlify como Site URL.

## Estructura de carpetas

```
src/app/
  estructuras/   las seis estructuras de datos
  modelos/       interfaces de los datos
  services/      supabase, auth, catálogo, carrito, pedidos y mensajes
  guards/        guard que protege las rutas privadas
  compartido/    barra de navegación
  paginas/       inicio, login, registro y 404
  catalogo/      restaurantes, detalle, buscador, carrito y sus componentes hijos
  cuenta/        perfil
  pedidos/       confirmar, mis pedidos, seguimiento, cocina y sus componentes hijos
src/estilos/     variables y estilos SASS por módulo
supabase/        scripts SQL de la base de datos
docs/            documento final y pantallas
```
