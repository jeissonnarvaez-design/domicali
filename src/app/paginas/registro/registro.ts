import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, RouterLink],
  templateUrl: './registro.html',
})
export class Registro {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  clave = '';
  repetir = '';
  msg = '';

  async registrar() {
    if (this.clave !== this.repetir) {
      this.msg = 'Las contrasenas no coinciden';
      return;
    }

    const { data, error } = await this.auth.registrar(this.email, this.clave);

    if (error) {
      this.msg = error.message;
    } else if (data.session) {
      this.router.navigate(['/inicio']);
    } else {
      // pasa cuando en supabase esta prendido el confirm email
      this.msg = 'Revisa tu correo para confirmar la cuenta';
    }
  }
}
