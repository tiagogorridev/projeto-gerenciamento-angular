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
    // Obter o token (pode ser do localStorage, serviço de autenticação, etc.)
    const token = localStorage.getItem('auth_token') || '';  // Substitua conforme a forma que você armazena o token

    // Configuração do cabeçalho com o token de autorização
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Enviar a requisição POST com o cabeçalho de autorização
    return this.http.post(this.baseUrl, projeto, { headers });
  }
}
