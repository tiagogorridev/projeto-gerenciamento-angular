import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../services/usuario.model';

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

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  // signup.component.ts
// signup.component.ts
onSubmit() {
  if (this.password !== this.confirmPassword) {
      console.error('As senhas não coincidem!');
      return;
  }

  const novoUsuario: Usuario = {
      nome: this.fullName,
      email: this.email,
      senha: this.password,
      perfil: 'ROLE_USER', // Define o perfil padrão
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