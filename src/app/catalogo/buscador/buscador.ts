import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Trie } from '../../estructuras/trie';
import { Plato, Restaurante } from '../../modelos/catalogo';
import { CarritoService } from '../../services/carrito.service';
import { CatalogoService } from '../../services/catalogo.service';
import { TarjetaPlato } from '../componentes/tarjeta-plato/tarjeta-plato';

@Component({
  selector: 'app-buscador',
  imports: [FormsModule, RouterLink, TarjetaPlato],
  templateUrl: './buscador.html',
})
export class Buscador implements OnInit {
  private catalogo = inject(CatalogoService);
  carrito = inject(CarritoService);

  private trie = new Trie();
  private platos: Plato[] = [];
  private restaurantes: Restaurante[] = [];

  texto = '';
  resultados = signal<Plato[]>([]);
  aviso = signal('');

  async ngOnInit() {
    const platos = await this.catalogo.listarPlatos();
    const restaurantes = await this.catalogo.listarRestaurantes();
    this.platos = platos.data ?? [];
    this.restaurantes = restaurantes.data ?? [];

    // cada palabra del nombre entra al trie, asi "doble" tambien encuentra "Hamburguesa doble"
    for (let plato of this.platos) {
      for (let palabra of plato.nombre.toLowerCase().split(' ')) {
        this.trie.insert(palabra, plato.id);
      }
    }
  }

  buscar(valor: string) {
    this.texto = valor;
    this.aviso.set('');

    const palabras = valor.toLowerCase().trim().split(' ').filter((p) => p !== '');
    if (palabras.length === 0) {
      this.resultados.set([]);
      return;
    }

    // si escriben varias palabras, el plato tiene que tener todas
    let ids = this.trie.searchByPrefix(palabras[0]);
    for (let palabra of palabras.slice(1)) {
      const otros = this.trie.searchByPrefix(palabra);
      ids = ids.filter((id) => otros.includes(id));
    }

    this.resultados.set(this.platos.filter((p) => ids.includes(p.id)));
  }

  lugar(plato: Plato): string {
    return this.restaurantes.find((r) => r.id === plato.restaurante_id)?.nombre ?? '';
  }

  agregar(plato: Plato) {
    const restaurante = this.restaurantes.find((r) => r.id === plato.restaurante_id)!;

    if (this.carrito.agregar(plato, restaurante)) {
      this.aviso.set(`${plato.nombre} quedo en el carrito`);
    } else {
      this.aviso.set(
        `Tu carrito tiene platos de ${this.carrito.restaurante()?.nombre}. Vacialo para pedir de otro lado.`,
      );
    }
  }
}
