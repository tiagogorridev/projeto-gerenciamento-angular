import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private usuarios: Usuario[] = [];
  private usuarioAtualSubject = new BehaviorSubject<Usuario | null>(null);
  usuarioAtual$ = this.usuarioAtualSubject.asObservable();

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

  getUserIdByEmail(email: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/by-email`, {
      params: { email }
    }).pipe(
      catchError(this.handleError)
    );
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUsuario(usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${usuario.id}`, usuario)
      .pipe(
        catchError(error => {
          let errorMessage = 'Ocorreu um erro ao atualizar o usuário';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  updatePersonalInfo(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${usuario.id}`, usuario)
      .pipe(
        catchError(error => {
          console.error('Erro ao atualizar informações pessoais:', error);
          throw error;
        })
      );
  }

  getEmails(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/emails`);
  }

  getEmailByUsuarioId(usuarioId: number): string | undefined {
    const usuario = this.usuarios.find(usuario => usuario.id === usuarioId);
    return usuario ? usuario.email : undefined;
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
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`).pipe(
      tap((response) => {
        console.log('Resposta da API:', response);
      }),
      catchError(this.handleError)
    );
  }

  verifyCurrentPassword(userId: number, currentPassword: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/usuarios/${userId}/verify-password`, { senha: currentPassword })
      .pipe(
        catchError(this.handleError)
      );
  }

  excluirUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUsuarioAtual(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/atual`)
      .pipe(
        tap(usuario => {
          this.usuarioAtualSubject.next(usuario);
        })
      );
  }

  listarInativos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/inativos`);
  }

  reativarUsuario(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/reativar`, {});
  }
}
