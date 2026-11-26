import { Nodo } from '../estructuras/arbol';
import { Categoria } from '../modelos/catalogo';

function nodo(id: string, nombre: string, icono: string): Nodo<Categoria> {
  return new Nodo({ id, nombre, icono });
}

function armarCategorias(): Nodo<Categoria> {
  const todas = nodo('todas', 'Todas', '🍽️');

  const rapida = nodo('rapida', 'Comida rapida', '🍔');
  rapida.agregarHijo(nodo('hamburguesas', 'Hamburguesas', '🍔'));
  rapida.agregarHijo(nodo('pizza', 'Pizza', '🍕'));
  rapida.agregarHijo(nodo('perros', 'Perros', '🌭'));

  const tipica = nodo('tipica', 'Tipica', '🍲');
  tipica.agregarHijo(nodo('colombiana', 'Colombiana', '🍲'));
  tipica.agregarHijo(nodo('empanadas', 'Empanadas', '🥟'));

  const saludable = nodo('saludable', 'Saludable', '🥗');
  saludable.agregarHijo(nodo('ensaladas', 'Ensaladas', '🥗'));
  saludable.agregarHijo(nodo('bowls', 'Bowls', '🥙'));

  const postres = nodo('postres', 'Postres', '🍰');
  postres.agregarHijo(nodo('helados', 'Helados', '🍦'));
  postres.agregarHijo(nodo('panaderia', 'Panaderia', '🥐'));

  todas.agregarHijo(rapida);
  todas.agregarHijo(tipica);
  todas.agregarHijo(saludable);
  todas.agregarHijo(postres);

  return todas;
}

export const CATEGORIAS = armarCategorias();

export function buscarCategoria(nodo: Nodo<Categoria>, id: string): Nodo<Categoria> | null {
  if (nodo.valor.id === id) return nodo;
  for (let hijo of nodo.hijos) {
    const encontrado = buscarCategoria(hijo, id);
    if (encontrado) return encontrado;
  }
  return null;
}
