import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class MensajesService {
  private sb = inject(SupabaseService).client;

  listar(pedidoId: number) {
    return this.sb
      .from('mensajes')
      .select('*')
      .eq('pedido_id', pedidoId)
      .order('created_at', { ascending: true });
  }

  enviar(pedidoId: number, texto: string, autor: string) {
    return this.sb.from('mensajes').insert({ pedido_id: pedidoId, texto, autor });
  }

  escuchar(canal: string, alCambiar: () => void) {
    return this.sb
      .channel(canal)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mensajes' }, alCambiar)
      .subscribe();
  }
}
