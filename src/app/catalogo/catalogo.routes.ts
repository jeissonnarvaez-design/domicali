import { Routes } from '@angular/router';
import { Restaurante } from './restaurante/restaurante';
import { Restaurantes } from './restaurantes/restaurantes';

export const CATALOGO_ROUTES: Routes = [
  { path: '', component: Restaurantes },
  { path: ':id', component: Restaurante },
];
