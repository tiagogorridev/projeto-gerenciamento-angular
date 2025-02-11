import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {
    // Certifique-se de que o backend espera 'senha' ou 'password' no corpo da requisição
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, {
        email: email,
        senha: password // Alterar se o backend esperar 'password'
    }).pipe(
        tap((response: LoginResponse) => {
            console.log("Resposta da API:", response); // Log para depuração

            if (response && response.token) {
                // Armazenando o token no localStorage
                localStorage.setItem('token', response.token);
            }
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