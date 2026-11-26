import { Component, Input } from '@angular/core';
import { POSICIONES, ZONAS } from '../../zonas';

interface Via {
  a: string;
  b: string;
}

@Component({
  selector: 'app-mapa-zonas',
  imports: [],
  templateUrl: './mapa-zonas.html',
})
export class MapaZonas {
  @Input() ruta: string[] = [];

  zonas = ZONAS.nodes;
  pos = POSICIONES;
  vias = this.armarVias();

  // en la lista de adyacencia cada via sale dos veces (a-b y b-a), aca se deja una sola
  private armarVias(): Via[] {
    const vias: Via[] = [];
    for (let zona of ZONAS.nodes) {
      for (let vecina of ZONAS.adjList[zona]) {
        if (zona < vecina) {
          vias.push({ a: zona, b: vecina });
        }
      }
    }
    return vias;
  }

  enRuta(via: Via): boolean {
    const i = this.ruta.indexOf(via.a);
    const j = this.ruta.indexOf(via.b);
    return i !== -1 && j !== -1 && Math.abs(i - j) === 1;
  }

  tipo(zona: string): string {
    if (this.ruta.length === 0) return '';
    if (zona === this.ruta[0]) return 'origen';
    if (zona === this.ruta[this.ruta.length - 1]) return 'destino';
    if (this.ruta.includes(zona)) return 'paso';
    return '';
  }
}
