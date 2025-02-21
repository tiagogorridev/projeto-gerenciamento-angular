import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectMemberService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getUserIdByEmail(email: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/usuarios/by-email`, {
      params: { email }
    });
  }

  getProjectMembers(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projetos/${projectId}/membros`);
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
}
