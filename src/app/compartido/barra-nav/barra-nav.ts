import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-barra-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './barra-nav.html',
})
export class BarraNav {
  auth = inject(AuthService);
  carrito = inject(CarritoService);
  private router = inject(Router);

  async salir() {
    await this.auth.salir();
    this.carrito.vaciar();
    this.router.navigate(['/inicio']);
  }
}
