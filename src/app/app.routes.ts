import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Login } from './paginas/login/login';
import { NoEncontrado } from './paginas/no-encontrado/no-encontrado';
import { Registro } from './paginas/registro/registro';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  // siempre de ultima
  { path: '**', component: NoEncontrado },
];
