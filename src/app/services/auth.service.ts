import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, senha })
      .pipe(
        tap((response: LoginResponse) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('perfil', response.perfil);  
        }),
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
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export interface LoginResponse {
  token: string;
  perfil: string; 
}
