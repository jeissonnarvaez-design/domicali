import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink],
  templateUrl: './carrito.html',
})
export class Carrito {
  carrito = inject(CarritoService);
}
