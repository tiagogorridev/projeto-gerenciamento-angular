import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssociarUsuarioService {
  private apiUrl = 'http://localhost:8080/api/associacoes/usuario-projeto';
  private projetosUrl = 'http://localhost:8080/api/projetos';

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

  addMemberToProject(userId: number, projectId: number): Observable<any> {
    return this.http.post(`${this.projetosUrl}/${projectId}/associar-usuario/${userId}`, {}, {
      responseType: 'text'
    });
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error('Erro ao associar o usuário ao projeto'));
  }
}
