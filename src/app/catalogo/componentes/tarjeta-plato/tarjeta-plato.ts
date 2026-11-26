import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Plato } from '../../../modelos/catalogo';

@Component({
  selector: 'app-tarjeta-plato',
  imports: [],
  template: `
    <div class="tarjeta-plato">
      <div>
        <h4>{{ plato.nombre }}</h4>
        <p>{{ plato.descripcion }}</p>
        @if (lugar) {
          <span class="lugar">{{ lugar }}</span>
        }
      </div>
      <div class="derecha">
        <strong>$ {{ plato.precio }}</strong>
        <button type="button" class="boton" (click)="agregar.emit(plato)">Agregar</button>
      </div>
    </div>
  `,
})
export class TarjetaPlato {
  @Input() plato!: Plato;
  // en el buscador se muestra de que restaurante es, en el detalle no hace falta
  @Input() lugar = '';

  @Output() agregar = new EventEmitter<Plato>();
}
