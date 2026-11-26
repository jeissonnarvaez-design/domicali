export class Node<T> {
  value: T;
  next: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList<T> {
  head: Node<T> | null;
  tail: Node<T> | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value: T): void {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
    } else {
      this.tail!.next = newNode;
    }

    this.tail = newNode;
    this.length++;
  }

  peek(value: T, current = this.head): Node<T> | null {
    while (current) {
      if (current.value === value) {
        return current;
      }

      current = current.next;
    }

    return null;
  }

  size(): number {
    return this.length;
  }

  // en la diapositiva remove recibe tambien current, pero adentro se vuelve a declarar,
  // asi que lo deje solo con value
  remove(value: T): void {
    if (!this.head) return;

    if (this.head.value === value) {
      this.head = this.head.next;

      if (!this.head) {
        this.tail = null;
      }

      this.length--;
      return;
    }

    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      if (!current.next) this.tail = current;
      this.length--;
    }
  }

  print(): void {
    let current = this.head;
    let result = '';
    while (current) {
      result += current.value + ' -> ';
      current = current.next;
    }
    console.log(result + 'null');
  }

  // para pintar la lista en la plantilla toca pasarla a arreglo, recorriendola igual que print
  toArray(): T[] {
    const valores: T[] = [];
    let current = this.head;
    while (current) {
      valores.push(current.value);
      current = current.next;
    }
    return valores;
  }
}
