import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Nodo } from '../../../estructuras/arbol';
import { Categoria } from '../../../modelos/catalogo';

// se llama a si mismo para pintar cada rama del arbol de categorias
@Component({
  selector: 'app-arbol-categorias',
  imports: [],
  templateUrl: './arbol-categorias.html',
})
export class ArbolCategorias {
  @Input() nodo!: Nodo<Categoria>;
  @Input() nivel = 0;
  @Input() seleccionada = 'todas';

  @Output() elegir = new EventEmitter<Nodo<Categoria>>();
}
