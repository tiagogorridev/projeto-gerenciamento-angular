import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, { email, senha }).pipe(
      tap(response => {
        console.log('Resposta do backend:', response);
        if (response && response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // Método para pegar o token armazenado no localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}