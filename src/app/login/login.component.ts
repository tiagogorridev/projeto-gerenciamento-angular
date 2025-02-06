import { Component } from '@angular/core';
import { Router } from '@angular/router';  // Importando o Router para navegação

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}  // Injetando o Router no construtor

  onSubmit() {
    // Lógica de Login
    console.log('Email', this.email);
    console.log('Password', this.password);

    // Aqui você faria a lógica de autenticação, mas vamos apenas simular o login

    // Se o login for bem-sucedido, redirecionar para o dashboard
    this.router.navigate(['/dashboard']);  // Substitua '/dashboard' com a rota correta do seu dashboard
  }
}
