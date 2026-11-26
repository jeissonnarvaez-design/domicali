import { Queue } from './cola';

export class Graph {
  nodes: string[];
  adjList: { [node: string]: string[] };

  constructor() {
    this.nodes = [];
    this.adjList = {};
  }

  addNode(node: string): void {
    if (!this.searchNode(node)) {
      this.nodes.push(node);
      this.adjList[node] = [];
    }
  }

  addEdge(node1: string, node2: string): void {
    this.adjList[node1].push(node2);
    this.adjList[node2].push(node1);
  }

  searchNode(node: string): string | undefined {
    if (!this.nodes.length) return undefined;
    return this.nodes.find((n) => n == node);
  }

  printAdjacency(node: string): void {
    if (this.searchNode(node)) {
      console.log(this.adjList[node]);
    }
  }

  printGraph(): void {
    console.log(this.adjList);
  }

  // recorrido por niveles (bfs) usando la cola: el primer camino que llega al destino
  // es el que pasa por menos zonas
  shortestPath(start: string, end: string): string[] {
    if (!this.searchNode(start) || !this.searchNode(end)) return [];

    const queue = new Queue<string>();
    const visited: string[] = [start];
    // de donde vine a cada zona, para despues armar el camino
    const parent: { [node: string]: string } = {};

    queue.enqueue(start);

    while (!queue.isEmpty()) {
      const current = queue.dequeue()!;
      if (current === end) break;

      for (let neighbor of this.adjList[current]) {
        if (!visited.includes(neighbor)) {
          visited.push(neighbor);
          parent[neighbor] = current;
          queue.enqueue(neighbor);
        }
      }
    }

    // se arma el camino de atras para adelante siguiendo los padres
    const path = [end];
    let step = end;
    while (step !== start) {
      step = parent[step];
      if (!step) return [];
      path.unshift(step);
    }

    return path;
  }
}
