import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Restaurante } from '../../../modelos/catalogo';

@Component({
  selector: 'app-tarjeta-restaurante',
  imports: [RouterLink],
  template: `
    <a class="tarjeta-restaurante" [routerLink]="['/restaurantes', restaurante.id]">
      <div class="icono">{{ icono }}</div>
      <div>
        <h3>{{ restaurante.nombre }}</h3>
        <p>{{ restaurante.descripcion }}</p>
        <span class="zona">{{ restaurante.zona }}</span>
      </div>
    </a>
  `,
})
export class TarjetaRestaurante {
  @Input() restaurante!: Restaurante;
  @Input() icono = '🍽️';
}
