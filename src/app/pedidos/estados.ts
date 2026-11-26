import { EstadoPedido } from '../modelos/pedidos';

export const TEXTO_ESTADO: { [estado in EstadoPedido]: string } = {
  pendiente: 'Preparando',
  en_camino: 'En camino',
  entregado: 'Entregado',
};

export function hora(fecha: string): string {
  return new Date(fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}
