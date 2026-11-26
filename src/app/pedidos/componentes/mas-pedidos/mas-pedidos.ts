import { Component, inject, OnInit, signal } from '@angular/core';
import { MinHeap } from '../../../estructuras/heap';
import { Pedido, PlatoContado } from '../../../modelos/pedidos';
import { PedidosService } from '../../../services/pedidos.service';

@Component({
  selector: 'app-mas-pedidos',
  imports: [],
  template: `
    @if (top().length > 0) {
      <section class="mas-pedidos">
        <h2>Lo mas pedido</h2>
        <ol>
          @for (plato of top(); track plato.nombre; let i = $index) {
            <li>
              <span class="puesto">{{ i + 1 }}</span>
              <span class="plato">{{ plato.nombre }}</span>
              <span class="veces">{{ plato.veces }} pedidos</span>
            </li>
          }
        </ol>
      </section>
    }
  `,
})
export class MasPedidos implements OnInit {
  private pedidos = inject(PedidosService);
  top = signal<PlatoContado[]>([]);
  k = 5;

  async ngOnInit() {
    const { data } = await this.pedidos.todos();
    this.top.set(this.topK(this.contar(data ?? []), this.k));
  }

  // cuantas veces se ha pedido cada plato, sumando las cantidades
  private contar(pedidos: Pedido[]): PlatoContado[] {
    const conteo: { [nombre: string]: number } = {};

    for (let pedido of pedidos) {
      for (let item of pedido.items) {
        conteo[item.nombre] = (conteo[item.nombre] ?? 0) + item.cantidad;
      }
    }

    return Object.keys(conteo).map((nombre) => ({ nombre, veces: conteo[nombre] }));
  }

  // se mete todo al heap y cuando pasa de k se saca el minimo,
  // asi al final quedan solo los k mas pedidos
  private topK(platos: PlatoContado[], k: number): PlatoContado[] {
    const heap = new MinHeap();

    for (let plato of platos) {
      heap.push(plato);
      if (heap.size() > k) {
        heap.pop();
      }
    }

    return heap.toArray().sort((a, b) => b.veces - a.veces);
  }
}
