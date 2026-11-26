import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private sb = inject(SupabaseService).client;

  listarRestaurantes() {
    return this.sb.from('restaurantes').select('*').order('nombre', { ascending: true });
  }

  restaurante(id: number) {
    return this.sb.from('restaurantes').select('*').eq('id', id);
  }

  platosDe(restauranteId: number) {
    return this.sb
      .from('platos')
      .select('*')
      .eq('restaurante_id', restauranteId)
      .order('precio', { ascending: true });
  }

  listarPlatos() {
    return this.sb.from('platos').select('*');
  }
}
