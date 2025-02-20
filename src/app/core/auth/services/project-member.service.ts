import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectMemberService {
  private baseUrl = '/api/associacoes';

  constructor(private http: HttpClient) {}

  addMemberToProject(userId: number, projectId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuario-projeto`, null, {
      params: {
        idUsuario: userId.toString(),
        idProjeto: projectId.toString()
      }
    });
  }

  getUserIdByEmail(email: string): Observable<number> {
    return this.http.get<number>('/api/usuarios/by-email', {
      params: { email }
    });
  }

  getProjectMembers(projectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projeto/${projectId}/membros`);
  }
}
