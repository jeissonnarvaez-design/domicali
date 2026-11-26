import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Pedido } from '../../modelos/pedidos';
import { PedidosService } from '../../services/pedidos.service';
import { SupabaseService } from '../../services/supabase.service';
import { hora, TEXTO_ESTADO } from '../estados';

@Component({
  selector: 'app-mis-pedidos',
  imports: [RouterLink],
  templateUrl: './mis-pedidos.html',
})
export class MisPedidos implements OnInit, OnDestroy {
  private srv = inject(PedidosService);
  private sb = inject(SupabaseService).client;
  private canal?: RealtimeChannel;
  private userId = '';

  pedidos = signal<Pedido[]>([]);
  cargando = signal(true);
  textoEstado = TEXTO_ESTADO;
  hora = hora;

  async ngOnInit() {
    const { data } = await this.sb.auth.getUser();
    this.userId = data.user!.id;

    await this.cargar();
    // si la cocina despacha un pedido, el estado cambia aca sin recargar
    this.canal = this.srv.escuchar('mis-pedidos', () => this.cargar());
  }

  async cargar() {
    const { data } = await this.srv.misPedidos(this.userId);
    this.pedidos.set(data ?? []);
    this.cargando.set(false);
  }

  ngOnDestroy() {
    if (this.canal) {
      this.sb.removeChannel(this.canal);
    }
  }
}
