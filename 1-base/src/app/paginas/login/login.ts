import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  clave = '';
  msg = '';

  async entrar() {
    const { error } = await this.auth.entrar(this.email, this.clave);
    if (error) this.msg = error.message;
    else this.router.navigate(['/inicio']);
  }
}
