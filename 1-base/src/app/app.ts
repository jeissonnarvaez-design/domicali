import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraNav } from './compartido/barra-nav/barra-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BarraNav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
