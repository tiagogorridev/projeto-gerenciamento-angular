import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loginError: boolean = false;
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.loginError = false;

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login bem sucedido', response);

        localStorage.setItem('token', response.token);
        localStorage.setItem('perfil', response.perfil);

        if (response.perfil === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (response.perfil === 'USUARIO') {
          this.router.navigate(['/user/dashboard']);
        } else {
          console.warn('Perfil não reconhecido:', response.perfil);
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        console.error('Erro no login', error);
        this.loginError = true;
        this.errorMessage = error.error?.message || 'Email ou senha incorretos';
      }
    });
  }
}
