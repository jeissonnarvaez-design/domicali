import { Injectable, signal } from '@angular/core';
import { LinkedList } from '../estructuras/lista-enlazada';
import { ItemCarrito, Plato, Restaurante } from '../modelos/catalogo';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private lista = new LinkedList<ItemCarrito>();

  // la lista no es un signal, entonces despues de cada cambio se copia aca para la pantalla
  items = signal<ItemCarrito[]>([]);
  restaurante = signal<Restaurante | null>(null);

  // devuelve false si el plato es de otro restaurante, un pedido sale de un solo lugar
  agregar(plato: Plato, restaurante: Restaurante): boolean {
    const actual = this.restaurante();
    if (actual && actual.id !== restaurante.id) {
      return false;
    }

    const existente = this.buscarPlato(plato.id);
    if (existente) {
      existente.cantidad++;
    } else {
      this.lista.append({ plato, cantidad: 1 });
      this.restaurante.set(restaurante);
    }

    this.refrescar();
    return true;
  }

  restar(item: ItemCarrito): void {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.refrescar();
    } else {
      this.quitar(item);
    }
  }

  quitar(item: ItemCarrito): void {
    this.lista.remove(item);

    if (this.lista.size() === 0) {
      this.restaurante.set(null);
    }
    this.refrescar();
  }

  vaciar(): void {
    this.lista = new LinkedList<ItemCarrito>();
    this.restaurante.set(null);
    this.refrescar();
  }

  cantidad(): number {
    let suma = 0;
    for (let item of this.items()) {
      suma += item.cantidad;
    }
    return suma;
  }

  total(): number {
    let suma = 0;
    for (let item of this.items()) {
      suma += item.plato.precio * item.cantidad;
    }
    return suma;
  }

  // recorre la lista nodo por nodo desde la cabeza hasta encontrar el plato
  private buscarPlato(platoId: number): ItemCarrito | null {
    let current = this.lista.head;
    while (current) {
      if (current.value.plato.id === platoId) {
        return current.value;
      }
      current = current.next;
    }
    return null;
  }

  private refrescar(): void {
    this.items.set(this.lista.toArray());
  }
}
