import { inject, Injectable } from '@angular/core';
import { EstadoPedido, Pedido } from '../modelos/pedidos';
import { SupabaseService } from './supabase.service';

export type NuevoPedido = Omit<Pedido, 'id' | 'user_id' | 'estado' | 'created_at'>;

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private sb = inject(SupabaseService).client;

  crear(pedido: NuevoPedido) {
    return this.sb.from('pedidos').insert(pedido);
  }

  misPedidos(userId: string) {
    return this.sb
      .from('pedidos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  }

  pedido(id: number) {
    return this.sb.from('pedidos').select('*').eq('id', id);
  }

  // en orden de llegada, el primero que entro es el primero que se atiende
  pendientes() {
    return this.sb
      .from('pedidos')
      .select('*')
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: true });
  }

  todos() {
    return this.sb.from('pedidos').select('*');
  }

  cambiarEstado(id: number, estado: EstadoPedido) {
    return this.sb.from('pedidos').update({ estado }).eq('id', id);
  }

  escuchar(canal: string, alCambiar: () => void) {
    return this.sb
      .channel(canal)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, alCambiar)
      .subscribe();
  }
}
