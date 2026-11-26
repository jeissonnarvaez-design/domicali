import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MasPedidos } from '../../pedidos/componentes/mas-pedidos/mas-pedidos';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, MasPedidos],
  templateUrl: './inicio.html',
})
export class Inicio {
  auth = inject(AuthService);
}
