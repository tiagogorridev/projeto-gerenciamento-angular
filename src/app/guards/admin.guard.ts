import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const perfil = localStorage.getItem('perfil');
    if (perfil !== 'ADMIN') {
      console.log('Acesso negado: Redirecionando para a página de login ou página inicial');
      this.router.navigate(['/login']);  // Redireciona para a página de login ou para uma página inicial
      return false;
    }
    return true;
  }
}