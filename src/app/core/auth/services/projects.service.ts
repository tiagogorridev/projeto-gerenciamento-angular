import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Projeto } from '../model/projeto.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private baseUrl: string = 'https://sistema-horas-a6e4955506b7.herokuapp.com/api/projetos';
  private clientesUrl: string = 'https://sistema-horas-a6e4955506b7.herokuapp.com/api/clientes';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código do erro: ${error.status}, mensagem: ${error.error?.message || error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

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

  getNomeClienteById(clienteId: number): Observable<string> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ nome: string }>(`${this.clientesUrl}/${clienteId}`, { headers })
      .pipe(
        map(response => response.nome)
      );
  }

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

  getEmailsUsuariosComProjetos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/usuarios/emails`)
      .pipe(
        catchError(this.handleError)
      );
  }

  listarUsuariosProjetos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuarios-projetos`);
  }
}
