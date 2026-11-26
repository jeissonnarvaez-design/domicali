import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Mensaje } from '../../../modelos/pedidos';
import { AuthService } from '../../../services/auth.service';
import { MensajesService } from '../../../services/mensajes.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-chat-pedido',
  imports: [FormsModule],
  templateUrl: './chat-pedido.html',
})
export class ChatPedido implements OnInit, OnDestroy {
  @Input() pedidoId!: number;

  private srv = inject(MensajesService);
  private sb = inject(SupabaseService).client;
  private auth = inject(AuthService);
  private canal?: RealtimeChannel;

  mensajes = signal<Mensaje[]>([]);
  texto = '';

  async ngOnInit() {
    await this.cargar();
    this.canal = this.srv.escuchar('chat-' + this.pedidoId, () => this.cargar());
  }

  async cargar() {
    const { data } = await this.srv.listar(this.pedidoId);
    this.mensajes.set(data ?? []);
  }

  async enviar() {
    if (!this.texto.trim()) return;
    await this.srv.enviar(this.pedidoId, this.texto.trim(), this.auth.correo());
    this.texto = '';
  }

  esMio(mensaje: Mensaje): boolean {
    return mensaje.autor === this.auth.correo();
  }

  ngOnDestroy() {
    if (this.canal) {
      this.sb.removeChannel(this.canal);
    }
  }
}
