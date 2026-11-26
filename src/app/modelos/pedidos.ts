export type EstadoPedido = 'pendiente' | 'en_camino' | 'entregado';

export interface ItemPedido {
  plato_id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Pedido {
  id: number;
  user_id: string;
  correo: string;
  restaurante_id: number;
  restaurante: string;
  zona_origen: string;
  zona_entrega: string;
  direccion: string;
  items: ItemPedido[];
  total: number;
  estado: EstadoPedido;
  created_at: string;
}

export interface Mensaje {
  id: number;
  pedido_id: number;
  user_id: string;
  autor: string;
  texto: string;
  created_at: string;
}

export interface PlatoContado {
  nombre: string;
  veces: number;
}
