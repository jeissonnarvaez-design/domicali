import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Queue } from '../../estructuras/cola';
import { Pedido } from '../../modelos/pedidos';
import { PedidosService } from '../../services/pedidos.service';
import { SupabaseService } from '../../services/supabase.service';
import { hora } from '../estados';

@Component({
  selector: 'app-cocina',
  imports: [],
  templateUrl: './cocina.html',
})
export class Cocina implements OnInit, OnDestroy {
  private srv = inject(PedidosService);
  private sb = inject(SupabaseService).client;
  private canal?: RealtimeChannel;

  private cola = new Queue<Pedido>();

  // copia de la cola para pintarla, la cola en si no es un signal
  enCola = signal<Pedido[]>([]);
  siguiente = signal<Pedido | null>(null);
  despachado = signal<Pedido | null>(null);
  hora = hora;

  async ngOnInit() {
    await this.cargar();
    // cuando alguien hace un pedido nuevo entra solo a la cola
    this.canal = this.srv.escuchar('cocina', () => this.cargar());
  }

  // la cola se arma con los pendientes en orden de llegada
  async cargar() {
    const { data } = await this.srv.pendientes();

    this.cola = new Queue<Pedido>();
    for (let pedido of data ?? []) {
      this.cola.enqueue(pedido);
    }

    this.refrescar();
  }

  // el que se despacha es siempre el primero que llego
  async despacharSiguiente() {
    const pedido = this.cola.dequeue();
    if (!pedido) return;

    this.despachado.set(pedido);
    this.refrescar();
    await this.srv.cambiarEstado(pedido.id, 'en_camino');
  }

  private refrescar() {
    this.enCola.set([...this.cola.items]);
    this.siguiente.set(this.cola.peek());
  }

  ngOnDestroy() {
    if (this.canal) {
      this.sb.removeChannel(this.canal);
    }
  }
}
