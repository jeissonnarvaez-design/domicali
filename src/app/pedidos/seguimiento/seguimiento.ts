import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RealtimeChannel } from '@supabase/supabase-js';
import { EstadoPedido, Pedido } from '../../modelos/pedidos';
import { PedidosService } from '../../services/pedidos.service';
import { SupabaseService } from '../../services/supabase.service';
import { ChatPedido } from '../componentes/chat-pedido/chat-pedido';
import { MapaZonas } from '../componentes/mapa-zonas/mapa-zonas';
import { TEXTO_ESTADO } from '../estados';
import { ZONAS } from '../zonas';

@Component({
  selector: 'app-seguimiento',
  imports: [RouterLink, MapaZonas, ChatPedido],
  templateUrl: './seguimiento.html',
})
export class Seguimiento implements OnInit, OnDestroy {
  private srv = inject(PedidosService);
  private sb = inject(SupabaseService).client;
  private canal?: RealtimeChannel;

  // /pedidos/7 -> id() = '7'
  id = input<string>();

  pedido = signal<Pedido | null>(null);
  ruta = signal<string[]>([]);
  textoEstado = TEXTO_ESTADO;
  pasos: EstadoPedido[] = ['pendiente', 'en_camino', 'entregado'];

  async ngOnInit() {
    await this.cargar();
    this.canal = this.srv.escuchar('seguimiento-' + this.id(), () => this.cargar());
  }

  async cargar() {
    const { data } = await this.srv.pedido(Number(this.id()));
    const pedido: Pedido | null = data?.[0] ?? null;
    this.pedido.set(pedido);

    if (pedido) {
      this.ruta.set(ZONAS.shortestPath(pedido.zona_origen, pedido.zona_entrega));
    }
  }

  // un paso queda marcado si el pedido ya paso por ahi
  completo(paso: EstadoPedido): boolean {
    const actual = this.pasos.indexOf(this.pedido()?.estado ?? 'pendiente');
    return this.pasos.indexOf(paso) <= actual;
  }

  async recibido() {
    await this.srv.cambiarEstado(this.pedido()!.id, 'entregado');
  }

  ngOnDestroy() {
    if (this.canal) {
      this.sb.removeChannel(this.canal);
    }
  }
}
