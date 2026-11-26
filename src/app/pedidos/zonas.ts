import { Graph } from '../estructuras/grafo';

// posicion de cada zona en el dibujo del mapa (el norte queda arriba)
export const POSICIONES: { [zona: string]: { x: number; y: number } } = {
  Norte: { x: 300, y: 60 },
  Oeste: { x: 120, y: 190 },
  Centro: { x: 290, y: 200 },
  Oriente: { x: 450, y: 220 },
  Sur: { x: 290, y: 340 },
  'Ciudad Jardin': { x: 220, y: 440 },
  Pance: { x: 110, y: 510 },
};

function armarZonas(): Graph {
  const zonas = new Graph();

  for (let zona of Object.keys(POSICIONES)) {
    zonas.addNode(zona);
  }

  // cada arista es una via que conecta dos zonas
  zonas.addEdge('Norte', 'Centro');
  zonas.addEdge('Norte', 'Oeste');
  zonas.addEdge('Norte', 'Oriente');
  zonas.addEdge('Centro', 'Oeste');
  zonas.addEdge('Centro', 'Oriente');
  zonas.addEdge('Centro', 'Sur');
  zonas.addEdge('Oeste', 'Sur');
  zonas.addEdge('Oriente', 'Sur');
  zonas.addEdge('Sur', 'Ciudad Jardin');
  zonas.addEdge('Ciudad Jardin', 'Pance');

  return zonas;
}

export const ZONAS = armarZonas();
