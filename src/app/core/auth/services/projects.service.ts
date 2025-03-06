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
    return this.http.get<any[]>(`${this.baseUrl}/usuario/${usuarioId}/projetos`, { headers });
  }

  getProjetosAssociados(usuarioId: number): Observable<Projeto[]> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/usuario/${usuarioId}/associacoes`, { headers }).pipe(
      map(response => {
        // Transformando a resposta para um array de projetos
        return response.map(projeto => ({
          ...projeto,
          usuarioResponsavel: projeto.usuarioResponsavel,
          cliente: projeto.cliente
        }));
      })
    );
  }

  // Método para atualizar um projeto
  updateProjeto(id: string, projeto: any): Observable<any> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const { cliente, ...projetoSemCliente } = projeto;
    return this.http.put(`${this.baseUrl}/${id}`, projetoSemCliente, { headers });
  }

  // Método para buscar um projeto por ID
  getProjetoById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getNomeClienteById(clienteId: number): Observable<string> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ nome: string }>(`http://localhost:8080/api/clientes/${clienteId}`, { headers })
      .pipe(
        map(response => response.nome)
      );
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

  getMembrosDoProjeto(projetoId: number): Observable<any[]> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.baseUrl}/${projetoId}/membros`, { headers }).pipe(
      map(response => {
        // Transform the response to an array of users if needed
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

  deleteTarefa(tarefaId: number): Observable<void> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`http://localhost:8080/api/tarefas/${tarefaId}`, { headers });
  }

  getHorasDisponiveis(projectId: string): Observable<number> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<number>(`${this.baseUrl}/${projectId}/horas-disponiveis`, { headers })
      .pipe(
        catchError(error => {
          console.error('Erro ao obter horas disponíveis:', error);
          throw error;
        })
      );
    }

    getTarefaById(projetoId: number, id: number): Observable<Tarefa> {
      return this.http.get<Tarefa>(`http://localhost:8080/api/tarefas/projeto/${projetoId}/tarefa/${id}`);
    }

    getTempoRegistradoProjeto(projetoId: number): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/${projetoId}/tempo-registrado`);
    }

    getProjetosPorUsuario(usuarioId: number): Observable<Projeto[]> {
      const token = localStorage.getItem('auth_token') || '';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Projeto[]>(`${this.baseUrl}/usuarios/${usuarioId}/projetos`);
    }

    getProjetos(): Observable<Projeto[]> {
      const token = localStorage.getItem('auth_token') || '';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<Projeto[]>(`${this.baseUrl}/getProjetos`, { headers });
    }

    deleteProjeto(id: number): Observable<any> {
      const token = localStorage.getItem('auth_token') || '';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.delete(`${this.baseUrl}/${id}`, {
        headers,
        responseType: 'text'
      });
    }

    listarTodasAssociacoes(): Observable<any[]> {
      const url = `${this.baseUrl}/associacoes`;
      return this.http.get<any[]>(url);
    }

    listarUsuariosProjetos(): Observable<any> {
      return this.http.get<any>(`$this.baseUrl/usuarios-projetos`);
    }

    getEmailsUsuariosComProjetos(): Observable<string[]> {
      return this.http.get<string[]>(`http://localhost:8080/api/projetos/usuarios/emails`)
        .pipe(
          catchError(this.handleError)
        );
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

    getUsuariosAssociadosProjeto(projetoId: number): Observable<any[]> {
      const token = localStorage.getItem('auth_token') || '';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<any[]>(`http://localhost:8080/api/projetos/${projetoId}/usuarios`, { headers }).pipe(
        map(response => {
          // Transformando a resposta para um array de usuários
          return response.map(usuario => ({
            ...usuario,
            email: usuario.email,
            nome: usuario.nome
          }));
        }),
        catchError(this.handleError)
      );
    }

}
