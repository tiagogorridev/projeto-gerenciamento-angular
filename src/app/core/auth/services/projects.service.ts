import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarefa } from './tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private baseUrl: string = 'http://localhost:8080/api/projetos';

  constructor(private http: HttpClient) { }

  // Método para criar projeto
  createProjeto(projeto: any): Observable<any> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.baseUrl, projeto, { headers });
  }

  // Método para buscar projetos de um usuário
  getProjetosDoUsuario(usuarioId: number): Observable<any[]> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/usuario/${usuarioId}`, { headers });
  }

  // Método para atualizar um projeto
  updateProjeto(id: string, projeto: any): Observable<any> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.baseUrl}/${id}`, projeto, { headers });
  }

  // Método para buscar um projeto por ID
  getProjetoById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // Método para criar uma nova tarefa
  createTarefa(tarefa: any): Observable<any> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post('http://localhost:8080/api/tarefas', tarefa, { headers });
  }

  // Método para buscar as tarefas de um projeto (ajustado para chamar o endpoint correto)
  getTarefasByProjeto(projectId: string): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`http://localhost:8080/api/tarefas/projeto/${projectId}`);
  }

  // Exemplo de método para buscar membros do projeto (se houver endpoint específico)
  getMembrosByProjeto(projectId: string): Observable<any[]> {
    // Ajuste a URL conforme a sua API para buscar os membros do projeto
    return this.http.get<any[]>(`http://localhost:8080/api/projetos/${projectId}/membros`);
  }
}
