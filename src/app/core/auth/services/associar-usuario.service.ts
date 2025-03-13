import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssociarUsuarioService {
  private apiUrl = 'https://sistema-horas-a6e4955506b7.herokuapp.com/api/usuario-projeto';
  private projetosUrl = 'https://sistema-horas-a6e4955506b7.herokuapp.com/api/projetos';

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
