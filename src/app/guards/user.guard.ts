import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const perfil = localStorage.getItem('perfil');

    if (perfil === 'ADMIN') {
      console.log('Acesso negado: Redirecionando administrador');
      this.router.navigate(['/dashboard']); // Redireciona admin para o dashboard
      return false;
    }

    // Se o perfil for "USUARIO", permite o acesso à página de perfil
    return true;
  }
}