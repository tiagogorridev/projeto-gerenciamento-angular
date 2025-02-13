import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../core/auth/services/usuario.service';
import { Usuario } from '../../../core/auth/services/usuario.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  perfil: 'ADMIN' | 'USUARIO' = 'USUARIO';

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      console.error('As senhas não coincidem!');
      return;
    }

    if (!this.perfil) {
      console.error("O campo 'perfil' não pode ser vazio");
      return;
    }

    const novoUsuario: Usuario = {
      nome: this.fullName,
      email: this.email,
      senha: this.password,
      perfil: this.perfil,
      confirmPassword: this.confirmPassword
    };

    this.usuarioService.cadastrarUsuario(novoUsuario).subscribe({
      next: (response) => {
        console.log('Usuário cadastrado com sucesso:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro ao cadastrar usuário:', error);
      }
    });
  }
}
