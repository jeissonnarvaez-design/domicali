export class Nodo<T> {
  valor: T;
  hijos: Nodo<T>[] = [];

  constructor(valor: T) {
    this.valor = valor;
  }

  agregarHijo(nodo: Nodo<T>): void {
    this.hijos.push(nodo);
  }
}

export function dfs<T>(nodo: Nodo<T>): void {
  console.log(nodo.valor);
  for (let hijo of nodo.hijos) {
    dfs(hijo);
  }
}

export function bfs<T>(raiz: Nodo<T>): void {
  const cola = [raiz];
  while (cola.length > 0) {
    const actual = cola.shift()!;
    console.log(actual.valor);
    cola.push(...actual.hijos);
  }
}

// mismo recorrido del dfs, pero en vez de imprimir guarda los nodos que no tienen hijos
export function hojas<T>(nodo: Nodo<T>, encontradas: T[] = []): T[] {
  if (nodo.hijos.length === 0) {
    encontradas.push(nodo.valor);
  }
  for (let hijo of nodo.hijos) {
    hojas(hijo, encontradas);
  }
  return encontradas;
}
