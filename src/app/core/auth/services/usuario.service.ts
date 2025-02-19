import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from './usuario.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  cadastrarUsuario(usuario: Usuario): Observable<any> {
    if (!usuario.perfil) {
      throw new Error("O campo 'perfil' é obrigatório");
    }

    return this.http.post<any>(`${this.apiUrl}/cadastro`, usuario)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${usuario.id}`, usuario);
  }

  getEmails(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/emails`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserEmail(): string | null {
    return localStorage.getItem('usuario');
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código do erro: ${error.status}, mensagem: ${error.error?.message || error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getUsuarioById(id: number) {
    console.log(`Buscando usuário com ID: ${id}`);
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`).pipe(
      tap((response) => {
        console.log('Resposta da API:', response);
      }),
      catchError(this.handleError)
    );
  }
}
