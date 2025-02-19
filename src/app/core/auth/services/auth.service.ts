import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userRole: string = 'admin';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  // Outros métodos de autenticação que você possa precisar
  getUserRole(): string {
    return this.userRole;
  }

  setUserRole(role: string): void {
    this.userRole = role;
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, senha })
      .pipe(
        tap((response: LoginResponse) => {
          console.log('Resposta do Login:', response);
          this.saveSession(response.token, response.perfil, response.id);
          this.isAuthenticatedSubject.next(true);
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

  logout(): Observable<any> {
    const token = this.getToken();

    if (!token) {
      this.clearSession();
      this.router.navigate(['/login']);
      return of(null);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => this.clearSession()),
      finalize(() => {
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('Erro no logout:', error);
        this.clearSession();
        return of(null);
      })
    );
  }

  private saveSession(token: string, perfil: string, usuarioId: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('perfil', perfil);
    localStorage.setItem('usuario_id', usuarioId);  // Armazenando usuario_id
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    sessionStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export interface LoginResponse {
  token: string;
  perfil: string;
  id: string;
}
