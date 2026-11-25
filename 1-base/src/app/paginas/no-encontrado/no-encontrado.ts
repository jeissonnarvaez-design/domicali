import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink],
  template: `
    <div class="vacio-pagina">
      <h1>404</h1>
      <p>La pagina que buscas no existe.</p>
      <a class="boton" routerLink="/inicio">Ir al inicio</a>
    </div>
  `,
})
export class NoEncontrado {}
