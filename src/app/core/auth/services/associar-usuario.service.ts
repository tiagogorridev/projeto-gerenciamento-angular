import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssociarUsuarioService {

  private apiUrl = '/api/associacoes/usuario-projeto';  // URL do backend

  constructor(private http: HttpClient) { }

  associarUsuarioAoProjeto(idUsuario: number, idProjeto: number): Observable<any> {
    return this.http.post(this.apiUrl, null, {
      params: {
        idUsuario: idUsuario.toString(),
        idProjeto: idProjeto.toString()
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Erro ao associar o usuário ao projeto'));
  }
}
