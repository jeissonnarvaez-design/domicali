export class Node {
  value: string | null;
  isEndOfWord: boolean;
  children: { [character: string]: Node };
  // ids de los platos que tienen esta palabra en el nombre
  ids: number[];

  constructor(value: string | null) {
    this.value = value;
    this.isEndOfWord = false;
    this.children = {};
    this.ids = [];
  }
}

export class Trie {
  root: Node;

  constructor() {
    this.root = new Node(null);
  }

  insert(word: string, id: number): void {
    let current = this.root;

    for (let character of word) {
      if (current.children[character] === undefined) {
        current.children[character] = new Node(character);
      }
      current = current.children[character];
    }

    current.isEndOfWord = true;
    if (!current.ids.includes(id)) {
      current.ids.push(id);
    }
  }

  search(word: string): boolean {
    let current = this.root;

    for (let character of word) {
      if (current.children[character] === undefined) {
        return false;
      }
      current = current.children[character];
    }

    return current.isEndOfWord;
  }

  // baja hasta donde termina el prefijo y recoge los ids de todo lo que cuelga de ahi
  searchByPrefix(prefix: string): number[] {
    let current = this.root;

    for (let character of prefix) {
      if (current.children[character] === undefined) {
        return [];
      }
      current = current.children[character];
    }

    return this.collect(current, []);
  }

  private collect(node: Node, found: number[]): number[] {
    if (node.isEndOfWord) {
      for (let id of node.ids) {
        if (!found.includes(id)) found.push(id);
      }
    }

    for (let character of Object.keys(node.children)) {
      this.collect(node.children[character], found);
    }

    return found;
  }
}
