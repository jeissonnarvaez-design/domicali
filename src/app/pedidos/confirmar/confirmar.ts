import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';
import { PedidosService } from '../../services/pedidos.service';
import { MapaZonas } from '../componentes/mapa-zonas/mapa-zonas';
import { ZONAS } from '../zonas';

@Component({
  selector: 'app-confirmar',
  imports: [FormsModule, RouterLink, MapaZonas],
  templateUrl: './confirmar.html',
})
export class Confirmar {
  carrito = inject(CarritoService);
  private auth = inject(AuthService);
  private pedidos = inject(PedidosService);
  private router = inject(Router);

  zonas = ZONAS.nodes;
  zona = '';
  direccion = '';
  ruta = signal<string[]>([]);
  msg = signal('');
  enviando = signal(false);

  elegirZona(zona: string) {
    this.zona = zona;
    this.msg.set('');
    const restaurante = this.carrito.restaurante();
    this.ruta.set(restaurante ? ZONAS.shortestPath(restaurante.zona, zona) : []);
  }

  async confirmar() {
    const restaurante = this.carrito.restaurante();
    if (!restaurante) return;

    if (!this.zona || !this.direccion.trim()) {
      this.msg.set('Escoge la zona y escribe la direccion');
      return;
    }

    this.enviando.set(true);

    const items = this.carrito.items().map((item) => ({
      plato_id: item.plato.id,
      nombre: item.plato.nombre,
      precio: item.plato.precio,
      cantidad: item.cantidad,
    }));

    const { error } = await this.pedidos.crear({
      correo: this.auth.correo(),
      restaurante_id: restaurante.id,
      restaurante: restaurante.nombre,
      zona_origen: restaurante.zona,
      zona_entrega: this.zona,
      direccion: this.direccion.trim(),
      items,
      total: this.carrito.total(),
    });

    this.enviando.set(false);

    if (error) {
      this.msg.set(error.message);
      return;
    }

    this.carrito.vaciar();
    this.router.navigate(['/pedidos']);
  }
}
