import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Plato, Restaurante as RestauranteModelo } from '../../modelos/catalogo';
import { CarritoService } from '../../services/carrito.service';
import { CatalogoService } from '../../services/catalogo.service';
import { buscarCategoria, CATEGORIAS } from '../categorias';
import { TarjetaPlato } from '../componentes/tarjeta-plato/tarjeta-plato';

@Component({
  selector: 'app-restaurante',
  imports: [RouterLink, TarjetaPlato],
  templateUrl: './restaurante.html',
})
export class Restaurante implements OnInit {
  private catalogo = inject(CatalogoService);
  carrito = inject(CarritoService);

  // /restaurantes/4 -> id() = '4'
  id = input<string>();

  restaurante = signal<RestauranteModelo | null>(null);
  platos = signal<Plato[]>([]);
  aviso = signal('');

  async ngOnInit() {
    const id = Number(this.id());

    const { data } = await this.catalogo.restaurante(id);
    this.restaurante.set(data?.[0] ?? null);

    const respuesta = await this.catalogo.platosDe(id);
    this.platos.set(respuesta.data ?? []);
  }

  icono(): string {
    const r = this.restaurante();
    return r ? (buscarCategoria(CATEGORIAS, r.categoria)?.valor.icono ?? '🍽️') : '';
  }

  agregar(plato: Plato) {
    const agregado = this.carrito.agregar(plato, this.restaurante()!);

    if (agregado) {
      this.aviso.set(`${plato.nombre} quedo en el carrito`);
    } else {
      this.aviso.set(
        `Tu carrito tiene platos de ${this.carrito.restaurante()?.nombre}. Vacialo para pedir aqui.`,
      );
    }
  }
}
