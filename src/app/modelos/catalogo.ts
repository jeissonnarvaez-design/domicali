export interface Restaurante {
  id: number;
  nombre: string;
  categoria: string;
  zona: string;
  descripcion: string;
}

export interface Plato {
  id: number;
  restaurante_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

export interface Categoria {
  id: string;
  nombre: string;
  icono: string;
}

export interface ItemCarrito {
  plato: Plato;
  cantidad: number;
}
