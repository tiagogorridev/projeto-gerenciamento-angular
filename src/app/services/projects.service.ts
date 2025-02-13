import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private baseUrl: string = 'http://localhost:8080/api/projetos';

  constructor(private http: HttpClient) { }

  createProjeto(projeto: any): Observable<any> {
    const token = localStorage.getItem('auth_token') || '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.baseUrl, projeto, { headers });
  }

  getProjetosDoUsuario(usuarioId: number): Observable<any[]> {
    const token = localStorage.getItem('auth_token') || '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.baseUrl}/usuario/${usuarioId}`, { headers });
}
}
