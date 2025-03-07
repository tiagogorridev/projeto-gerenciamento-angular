import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Tarefa } from './tarefa.model';
import { Projeto } from './projeto.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private baseUrl: string = 'http://localhost:8080/api/projetos';
  private tarefasUrl: string = 'http://localhost:8080/api/tarefas';
  private clientesUrl: string = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) { }

  // Métodos utilitários privados
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro retornado pelo backend
      errorMessage = `Código do erro: ${error.status}, mensagem: ${error.error?.message || error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Métodos para gerenciar projetos
  getProjetos(): Observable<Projeto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Projeto[]>(`${this.baseUrl}/getProjetos`, { headers });
  }

  getProjetoById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createProjeto(projeto: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.baseUrl, projeto, { headers });
  }

  updateProjeto(id: string, projeto: any): Observable<any> {
    const headers = this.getAuthHeaders();
    const { cliente, ...projetoSemCliente } = projeto;
    return this.http.put(`${this.baseUrl}/${id}`, projetoSemCliente, { headers });
  }

  deleteProjeto(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers,
      responseType: 'text'
    });
  }

  // Métodos relacionados a projetos de usuários
  getProjetosDoUsuario(usuarioId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/usuario/${usuarioId}/projetos`, { headers });
  }

  getProjetosAssociados(usuarioId: number): Observable<Projeto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/usuario/${usuarioId}/associacoes`, { headers }).pipe(
      map(response => {
        return response.map(projeto => ({
          ...projeto,
          usuarioResponsavel: projeto.usuarioResponsavel,
          cliente: projeto.cliente
        }));
      })
    );
  }

  getProjetosPorUsuario(usuarioId: number): Observable<Projeto[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Projeto[]>(`${this.baseUrl}/usuarios/${usuarioId}/projetos`);
  }

  // Métodos relacionados a membros e associações
  getMembrosDoProjeto(projetoId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/${projetoId}/membros`, { headers }).pipe(
      map(response => {
        return response.map(usuario => ({
          ...usuario,
          email: usuario.email,
          nome: usuario.nome
        }));
      }),
      catchError(this.handleError)
    );
  }

  getUsuariosAssociadosProjeto(projetoId: number): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/${projetoId}/usuarios`, { headers }).pipe(
      map(response => {
        return response.map(usuario => ({
          ...usuario,
          email: usuario.email,
          nome: usuario.nome
        }));
      }),
      catchError(this.handleError)
    );
  }

  addMemberToProject(userId: number, projectId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${projectId}/associar-usuario/${userId}`, {}, {
      responseType: 'text'
    });
  }

  listarTodasAssociacoes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/associacoes`);
  }

  listarUsuariosProjetos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios-projetos`);
  }

  getEmailsUsuariosComProjetos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/usuarios/emails`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Métodos relacionados a clientes
  getNomeClienteById(clienteId: number): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ nome: string }>(`${this.clientesUrl}/${clienteId}`, { headers })
      .pipe(
        map(response => response.nome)
      );
  }

  // Métodos relacionados a tarefas
  createTarefa(tarefa: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.tarefasUrl, tarefa, { headers });
  }

  getTarefasByProjeto(projectId: string): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.tarefasUrl}/projeto/${projectId}`);
  }

  getTarefaById(projetoId: number, id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.tarefasUrl}/projeto/${projetoId}/tarefa/${id}`);
  }

  deleteTarefa(tarefaId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.tarefasUrl}/${tarefaId}`, { headers });
  }

  // Métodos relacionados a horas e tempo
  getHorasDisponiveis(projectId: string): Observable<number> {
    const headers = this.getAuthHeaders();
    return this.http.get<number>(`${this.baseUrl}/${projectId}/horas-disponiveis`, { headers })
      .pipe(
        catchError(error => {
          console.error('Erro ao obter horas disponíveis:', error);
          throw error;
        })
      );
  }

  getTempoRegistradoProjeto(projetoId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${projetoId}/tempo-registrado`);
  }
}
