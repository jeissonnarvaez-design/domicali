import { PlatoContado } from '../modelos/pedidos';

// el heap de la clase compara numeros sueltos, aca cada elemento es un plato
// y se compara por las veces que lo han pedido
export class MinHeap {
  heap: PlatoContado[] = [];

  constructor(initial: PlatoContado[] = []) {
    if (initial.length > 0) {
      this.heap = [...initial];
      this.heapify();
    }
  }

  push(value: PlatoContado): void {
    this.heap.push(value);
    this.percolateUp();
  }

  pop(): PlatoContado | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }

    const n = this.heap.length;
    this.swap(0, n - 1);

    const min = this.heap.pop();
    this.percolateDown(0);

    return min;
  }

  peek(): PlatoContado | undefined {
    return this.heap[0];
  }

  heapify(): void {
    const start = Math.floor((this.heap.length - 2) / 2);

    for (let i = start; i >= 0; i--) {
      this.percolateDown(i);
    }
  }

  percolateDown(index: number): void {
    let curr = index;

    while (2 * curr + 1 < this.heap.length) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;

      const minChild =
        right < this.heap.length && this.heap[right].veces < this.heap[left].veces ? right : left;

      if (this.heap[minChild].veces < this.heap[curr].veces) {
        this.swap(curr, minChild);
        curr = minChild;
      } else {
        break;
      }
    }
  }

  percolateUp(): void {
    let curr = this.heap.length - 1;

    while (curr > 0) {
      const parent = Math.floor((curr - 1) / 2);

      if (this.heap[curr].veces < this.heap[parent].veces) {
        this.swap(curr, parent);
        curr = parent;
      } else {
        break;
      }
    }
  }

  swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  size(): number {
    return this.heap.length;
  }

  toArray(): PlatoContado[] {
    return [...this.heap];
  }
}
