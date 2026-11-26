import { Component, inject, OnInit, signal } from '@angular/core';
import { hojas, Nodo } from '../../estructuras/arbol';
import { Categoria, Restaurante } from '../../modelos/catalogo';
import { CatalogoService } from '../../services/catalogo.service';
import { buscarCategoria, CATEGORIAS } from '../categorias';
import { ArbolCategorias } from '../componentes/arbol-categorias/arbol-categorias';
import { TarjetaRestaurante } from '../componentes/tarjeta-restaurante/tarjeta-restaurante';

@Component({
  selector: 'app-restaurantes',
  imports: [ArbolCategorias, TarjetaRestaurante],
  templateUrl: './restaurantes.html',
})
export class Restaurantes implements OnInit {
  private catalogo = inject(CatalogoService);

  raiz = CATEGORIAS;
  seleccionada = signal('todas');

  todos = signal<Restaurante[]>([]);
  visibles = signal<Restaurante[]>([]);
  cargando = signal(true);

  async ngOnInit() {
    const { data } = await this.catalogo.listarRestaurantes();
    this.todos.set(data ?? []);
    this.visibles.set(data ?? []);
    this.cargando.set(false);
  }

  filtrar(nodo: Nodo<Categoria>) {
    this.seleccionada.set(nodo.valor.id);

    // los restaurantes estan guardados con la categoria final (pizza, helados...),
    // asi que si eligen "Comida rapida" toca traer todas las hojas de esa rama
    const categorias = hojas(nodo).map((c) => c.id);
    this.visibles.set(this.todos().filter((r) => categorias.includes(r.categoria)));
  }

  iconoDe(restaurante: Restaurante): string {
    return buscarCategoria(this.raiz, restaurante.categoria)?.valor.icono ?? '🍽️';
  }
}
