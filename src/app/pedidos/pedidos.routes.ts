import { Routes } from '@angular/router';
import { Confirmar } from './confirmar/confirmar';
import { MisPedidos } from './mis-pedidos/mis-pedidos';
import { Seguimiento } from './seguimiento/seguimiento';

export const PEDIDOS_ROUTES: Routes = [
  { path: '', component: MisPedidos },
  // confirmar va antes de :id, si no el router cree que "confirmar" es un id
  { path: 'confirmar', component: Confirmar },
  { path: ':id', component: Seguimiento },
];
