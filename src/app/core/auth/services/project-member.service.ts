import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectMemberService {
  // Update base URL to point to the backend server
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getUserIdByEmail(email: string): Observable<number> {
    // Update to use the correct endpoint that exists in UsuarioController
    return this.http.get<number>(`${this.baseUrl}/usuarios/by-email`, {
      params: { email }
    });
  }

  getProjectMembers(projectId: number): Observable<any[]> {
    // Update to use the correct endpoint
    return this.http.get<any[]>(`${this.baseUrl}/projetos/${projectId}/membros`);
  }
}
