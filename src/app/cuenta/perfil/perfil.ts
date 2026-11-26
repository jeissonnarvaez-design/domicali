import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-perfil',
  imports: [],
  templateUrl: './perfil.html',
})
export class Perfil {
  private sb = inject(SupabaseService).client;
  auth = inject(AuthService);
  url = signal('');
  subiendo = signal(false);

  async subir(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.subiendo.set(true);
    const {
      data: { user },
    } = await this.sb.auth.getUser();

    // la primera carpeta es el id del usuario, que es lo que revisa la politica del bucket
    const ruta = `${user!.id}/${Date.now()}-${file.name}`;
    const { error } = await this.sb.storage.from('avatars').upload(ruta, file, { upsert: true });
    this.subiendo.set(false);

    if (error) {
      return alert(error.message);
    }

    this.url.set(this.sb.storage.from('avatars').getPublicUrl(ruta).data.publicUrl);
  }
}
