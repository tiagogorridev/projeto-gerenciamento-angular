import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from './../../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ProjectMemberService {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getProjectMembers(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projetos/${projectId}/membros`).pipe(
      catchError(this.handleError)
    );
  }

  removeProjectMember(projectId: number, userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/projetos/${projectId}/remover-usuario/${userId}`, {
      responseType: 'text'
    }).pipe(
      catchError(error => {
        if (error.status !== 200) {
          console.error('Erro ao remover membro:', error);
          return throwError(() => new Error('Erro ao remover membro do projeto'));
        }
        return error.error.text;
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Ocorreu um erro na operação:', error);
    return throwError(() => new Error('Erro na comunicação com o servidor'));
  }
}
