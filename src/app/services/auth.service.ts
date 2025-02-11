import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, senha })
      .pipe(
        catchError(error => {
          console.error('Erro no login:', error);
          let message = 'Erro ao realizar login';
          if (error.error?.message) {
            message = error.error.message;
          }
          return throwError(() => new Error(message));
        })
      );
}

  logout(): void {
    // Remover o token do localStorage ao fazer logout
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    // Verifica se há um token no localStorage
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    // Retorna o token armazenado no localStorage
    return localStorage.getItem('token');
  }
}

// 🔹 Interface deve ser declarada FORA da classe
export interface LoginResponse {
  token: string; // Token JWT retornado após o login
  message?: string; // Mensagem de erro ou sucesso (se houver)
  statusCode?: number; // Código de status HTTP, caso seja necessário
}
