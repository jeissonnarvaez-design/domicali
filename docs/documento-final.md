# DomiCali - Documento final

**Estructuras de Datos II - Universidad Autónoma de Occidente**

Integrantes: Jeisson Narváez Preciado, Sebastián Ocampo Ospina

---

## 1. Qué es DomiCali

Es una plataforma de domicilios para Cali. Tiene dos lados:

- **El cliente** busca restaurantes por categoría o busca directamente un plato, lo agrega al
  carrito, escoge a qué zona de la ciudad se lo llevan y confirma. Después sigue el pedido: ve en
  qué estado va, la ruta que hace el repartidor en un mapa de zonas y puede escribirle por chat.
- **La cocina** ve los pedidos pendientes en el orden en que llegaron y los va despachando. Cuando
  despacha uno, el cliente ve el cambio de estado al instante, sin recargar.

## 2. Alcance

Lo que sí hace:

- Registro, inicio y cierre de sesión con Supabase.
- Menú público (inicio, restaurantes, buscador) y menú privado (carrito, mis pedidos, cocina,
  perfil). Las rutas privadas están protegidas con un guard.
- Catálogo de 12 restaurantes y 32 platos, filtrable por un árbol de categorías.
- Buscador de platos que muestra resultados mientras se escribe.
- Carrito con cantidades, subtotales y total.
- Creación de pedidos guardados en base de datos con el detalle de los platos.
- Seguimiento del pedido con estados, mapa de la ruta y chat en tiempo real.
- Panel de cocina con los pedidos en cola.
- Ranking de los cinco platos más pedidos.
- Foto de perfil subida a Supabase Storage.

Lo que no hace, y por qué:

- **No hay pagos.** El total se calcula, pero no hay pasarela de pago. Se sale del tema del curso.
- **No hay roles.** Cualquier usuario con sesión puede entrar a la cocina. En un sistema real la
  cocina sería un rol aparte; aquí lo dejamos abierto para poder mostrar el flujo completo con dos
  cuentas.
- **El mapa es por zonas, no por calles.** Cali está dividida en siete zonas conectadas entre sí,
  y la ruta se calcula entre zonas. Un mapa de calles real necesitaría una librería externa que no
  vimos en el curso.
- **El carrito vive en memoria.** Si se recarga la página, se vacía. Los pedidos confirmados sí
  quedan guardados.
- **Un pedido sale de un solo restaurante.** Si el carrito tiene platos de un restaurante, no deja
  agregar de otro. Así funcionan las aplicaciones de domicilios, porque un repartidor recoge en un
  solo lugar.

## 3. Tecnologías

| Tecnología | Para qué |
| --- | --- |
| Angular 21 | Frontend: componentes, signals, router, guards y lazy loading |
| Supabase Auth | Registro e inicio de sesión con correo y contraseña |
| Supabase Database | Postgres con políticas RLS para restaurantes, platos, pedidos y mensajes |
| Supabase Realtime | Chat, cola de la cocina y estado del pedido en vivo |
| Supabase Storage | Fotos de perfil |
| SASS | Estilos con variables, mixins y un archivo por módulo |
| Netlify | Despliegue del frontend |
| Git y GitHub | Control de versiones, una rama por integrante |

## 4. Cómo está organizado

### Rutas

| Ruta | Acceso | Carga |
| --- | --- | --- |
| `/inicio` | Pública | Normal |
| `/login`, `/registro` | Pública | Normal |
| `/restaurantes`, `/restaurantes/:id` | Pública | Lazy (`loadChildren`) |
| `/buscar` | Pública | Lazy (`loadComponent`) |
| `/carrito` | Privada | Lazy |
| `/perfil` | Privada | Lazy |
| `/pedidos`, `/pedidos/confirmar`, `/pedidos/:id` | Privada | Lazy (`loadChildren`) |
| `/cocina` | Privada | Lazy |
| `**` | Pública | Página 404 |

El guard pregunta a Supabase si hay sesión antes de dejar entrar; si no la hay, manda al login.
`/restaurantes/:id` y `/pedidos/:id` son rutas dinámicas: el id llega al componente con `input()`
gracias a `withComponentInputBinding()`.

Cada módulo tiene su propio archivo de rutas (`catalogo.routes.ts`, `pedidos.routes.ts`), que se
carga solo cuando el usuario entra a esa sección.

### Componentes padres e hijos

| Padre | Hijos | Cómo se comunican |
| --- | --- | --- |
| `App` | `BarraNav` | La barra lee la sesión y el carrito desde los servicios |
| `Restaurantes` | `ArbolCategorias`, `TarjetaRestaurante` | El árbol avisa con `@Output() elegir` qué categoría se escogió |
| `ArbolCategorias` | `ArbolCategorias` (a sí mismo) | Se pinta recursivamente, una vez por cada nodo del árbol |
| `Restaurante`, `Buscador` | `TarjetaPlato` | La tarjeta recibe el plato por `@Input` y avisa con `@Output() agregar` |
| `Confirmar`, `Seguimiento` | `MapaZonas` | El mapa recibe la ruta por `@Input` |
| `Seguimiento` | `ChatPedido` | El chat recibe el id del pedido por `@Input` |
| `Inicio` | `MasPedidos` | El ranking se arma solo con el servicio de pedidos |

Los datos que se comparten entre páginas (sesión, carrito) viven en servicios con
`providedIn: 'root'`, así no hay que pasarlos de componente en componente.

### Base de datos

| Tabla | Qué guarda | Quién la puede leer | Quién la puede escribir |
| --- | --- | --- | --- |
| `restaurantes` | Nombre, categoría, zona y descripción | Cualquiera | Nadie desde la app |
| `platos` | Nombre, descripción y precio, ligado a su restaurante | Cualquiera | Nadie desde la app |
| `pedidos` | Platos, total, zonas, dirección, estado y dueño | Usuarios con sesión | Cada usuario crea los suyos; el estado lo cambia cualquiera con sesión |
| `mensajes` | Texto del chat, autor y pedido al que pertenece | Usuarios con sesión | Cada usuario envía a su nombre |

El dueño de cada pedido y de cada mensaje (`user_id`) lo pone la base de datos con
`default auth.uid()`; la aplicación nunca lo envía, así nadie puede crear algo a nombre de otro.
Las políticas RLS se cumplen en el servidor, no en el navegador.

`pedidos` y `mensajes` están en la publicación de realtime. Cada pantalla que necesita datos en vivo
se suscribe a un canal y cierra la suscripción en `ngOnDestroy`.

## 5. Estructuras de datos

Implementamos seis, una más de las cinco que pide la rúbrica. Todas siguen el código visto en clase;
abajo explicamos dónde se usa cada una y por qué escogimos esa y no otra.

### 5.1 Lista enlazada - carrito de compras

**Archivo:** `src/app/estructuras/lista-enlazada.ts` · **Servicio:** `services/carrito.service.ts`

Cada plato del carrito es un nodo con su valor (el plato y la cantidad) y una referencia al
siguiente. La lista guarda la cabeza (`head`), la cola (`tail`) y el tamaño (`length`).

- `append` agrega un plato nuevo al final.
- `remove` quita un plato y une el nodo anterior con el siguiente.
- `size` dice cuántos platos distintos hay.
- Para saber si un plato ya está y sumarle cantidad, el servicio recorre la lista desde la cabeza
  nodo por nodo.

**Por qué una lista enlazada:** el carrito cambia todo el tiempo: se agregan y se quitan platos en
cualquier posición. En una lista enlazada quitar un elemento es mover una referencia, no correr todos
los elementos de un arreglo. Además, el carrito se recorre siempre completo y en orden (para mostrarlo
y para sumar el total), que es justo como se recorre una lista.

### 5.2 Cola - pedidos de la cocina

**Archivo:** `src/app/estructuras/cola.ts` · **Página:** `pedidos/cocina`

Los pedidos pendientes se meten a la cola con `enqueue` en el orden en que llegaron. La cocina ve
cuál sigue con `peek` y lo despacha con `dequeue`.

**Por qué una cola:** un restaurante tiene que atender primero al que pidió primero. Eso es FIFO,
exactamente lo que hace una cola. Si fuera una pila, el último que pidió saldría primero y el primero
se quedaría esperando. La cola también se usa dentro del grafo para calcular la ruta (ver 5.6).

### 5.3 Árbol - categorías de restaurantes

**Archivo:** `src/app/estructuras/arbol.ts` · **Datos:** `catalogo/categorias.ts`

Las categorías forman un árbol n-ario:

```
Todas
├── Comida rápida → Hamburguesas, Pizza, Perros
├── Típica        → Colombiana, Empanadas
├── Saludable     → Ensaladas, Bowls
└── Postres       → Helados, Panadería
```

Cada nodo tiene su valor y su lista de hijos, y se arma con `agregarHijo`. Cada restaurante está
guardado con una categoría final (una hoja). Cuando el usuario escoge "Comida rápida", la función
`hojas` recorre esa rama en profundidad y devuelve Hamburguesas, Pizza y Perros; con eso se filtran
los restaurantes. El panel lateral también se pinta recorriendo el árbol: el componente
`ArbolCategorias` se llama a sí mismo por cada hijo.

**Por qué un árbol:** las categorías son jerárquicas por naturaleza: una pizzería es comida rápida,
pero comida rápida no es solo pizza. Con una lista plana habría que repetir en cada restaurante todas
sus categorías padre. Con el árbol basta guardar la hoja y la jerarquía sale del recorrido. Agregar
una categoría nueva es agregar un nodo.

### 5.4 Trie - buscador de platos

**Archivo:** `src/app/estructuras/trie.ts` · **Página:** `catalogo/buscador`

Cuando se abre el buscador, cada palabra del nombre de cada plato entra al trie letra por letra con
`insert`. El nodo donde termina la palabra guarda los ids de los platos que la contienen. Al escribir,
`searchByPrefix` baja por las letras del prefijo y recoge todos los ids que cuelgan de ahí.

Ejemplos: `ham` encuentra las tres hamburguesas, `doble` encuentra "Hamburguesa doble" aunque no es
la primera palabra, y `pizza pep` encuentra solo "Pizza pepperoni", porque cuando se escriben varias
palabras el plato tiene que tenerlas todas.

Sobre el trie de clase agregamos dos cosas: los `ids` en el nodo final, para saber a qué platos
corresponde cada palabra, y `searchByPrefix`, porque el `search` de clase solo responde si la palabra
exacta existe.

**Por qué un trie:** buscar por prefijo en una lista obliga a revisar todos los platos cada vez que se
escribe una letra. En el trie solo se recorren tantos nodos como letras tiene el prefijo, sin importar
cuántos platos haya. Por eso los resultados pueden salir mientras se escribe.

### 5.5 Heap - platos más pedidos

**Archivo:** `src/app/estructuras/heap.ts` · **Componente:** `pedidos/componentes/mas-pedidos`

Se cuentan las veces que se ha pedido cada plato sumando las cantidades de todos los pedidos. Después
se meten los platos uno por uno a un MinHeap, y cada vez que el heap pasa de cinco elementos se saca
el mínimo con `pop`. Al final quedan los cinco más pedidos.

El heap de clase compara números; el nuestro compara por el campo `veces` de cada plato. El resto
(`push`, `pop`, `percolateUp`, `percolateDown`, `heapify`) es igual.

**Por qué un heap:** para sacar los cinco mejores no hace falta ordenar todos los platos. El heap
siempre tiene el menor de los que lleva en la raíz, que es justo el que hay que sacar cuando entra uno
mejor. Por eso es un **Min**Heap aunque buscamos los **mayores**: lo que se bota en cada paso es el
peor de los que van ganando.

### 5.6 Grafo - zonas de Cali y ruta de entrega

**Archivo:** `src/app/estructuras/grafo.ts` · **Datos:** `pedidos/zonas.ts` · **Componente:**
`pedidos/componentes/mapa-zonas`

Cali está representada como un grafo no dirigido de siete zonas (Norte, Oeste, Centro, Oriente, Sur,
Ciudad Jardín y Pance). Cada zona es un nodo y cada vía entre dos zonas es una arista. Como el grafo
es no dirigido, `addEdge` agrega la conexión en los dos sentidos.

Cada restaurante tiene una zona y el cliente escoge la suya al confirmar. `shortestPath` calcula la
ruta: recorre el grafo por niveles usando la cola (5.2), guardando de qué zona llegó a cada una, y
cuando encuentra el destino arma el camino de atrás para adelante. Como recorre por niveles, el primer
camino que encuentra es el que pasa por menos zonas. La ruta se pinta en el mapa con las vías
resaltadas.

**Por qué un grafo:** las zonas de una ciudad no forman una jerarquía ni una secuencia: cada una se
conecta con varias, y hay más de un camino entre dos zonas. Eso es un grafo. Con la lista de
adyacencia se sabe al instante con qué zonas limita cada una, que es lo que necesita el recorrido.

## 6. Repartición del trabajo

**Jeisson Narváez Preciado** (`main` y `jeisson-pedidos`)

- Base del proyecto: configuración de Angular y Supabase, servicio de autenticación, guard, barra de
  navegación, inicio, login, registro y página 404.
- Pedidos: confirmar pedido, mis pedidos, seguimiento y cocina.
- Estructuras: cola, heap y grafo.
- Tiempo real: chat, cola de la cocina y estado del pedido.
- Script `supabase/pedidos.sql`.

**Sebastián Ocampo Ospina** (`sebastian-catalogo` y `sebastian-documentacion`)

- Catálogo: listado con árbol de categorías, detalle de restaurante y buscador.
- Carrito de compras y perfil con foto.
- Estructuras: lista enlazada, árbol y trie.
- Script `supabase/catalogo.sql`.
- README, documento final y pantallas de la propuesta gráfica.
