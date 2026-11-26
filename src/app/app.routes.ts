import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Inicio } from './paginas/inicio/inicio';
import { Login } from './paginas/login/login';
import { NoEncontrado } from './paginas/no-encontrado/no-encontrado';
import { Registro } from './paginas/registro/registro';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  // catalogo: publico
  {
    path: 'restaurantes',
    loadChildren: () => import('./catalogo/catalogo.routes').then((m) => m.CATALOGO_ROUTES),
  },
  {
    path: 'buscar',
    loadComponent: () => import('./catalogo/buscador/buscador').then((m) => m.Buscador),
  },

  // privado
  {
    path: 'carrito',
    canActivate: [authGuard],
    loadComponent: () => import('./catalogo/carrito/carrito').then((m) => m.Carrito),
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./cuenta/perfil/perfil').then((m) => m.Perfil),
  },

  // siempre de ultima
  { path: '**', component: NoEncontrado },
];
