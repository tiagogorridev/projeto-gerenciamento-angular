import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Tarefa } from '../model/tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  private apiUrl = 'http://localhost:8080/api/tarefas';
  private projetosUrl = 'http://localhost:8080/api/projetos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createTarefa(tarefa: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(this.apiUrl, tarefa, { headers });
  }

  getTarefaById(projetoId: number, id: number): Observable<Tarefa> {
    return this.http.get<Tarefa>(`${this.apiUrl}/projeto/${projetoId}/tarefa/${id}`);
  }

  deleteTarefa(tarefaId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${tarefaId}`, { headers });
  }

  getTarefasByProjeto(projectId: string): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.apiUrl}/projeto/${projectId}`);
  }

  getProjectTasks(projectId: string) {
    return this.http.get<Tarefa[]>(`/api/projetos/${projectId}/tarefas`);
  }

  getProjectTasksUsers(projectId: string): Observable<Tarefa[]> {
    const url = `${this.apiUrl}/projetos/${projectId}/tarefas`;
    return this.http.get<Tarefa[]>(url).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getTarefaDetails(idprojeto: number, idtarefa: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/detalhes/${idprojeto}/${idtarefa}`).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  atualizarTarefa(idprojeto: number, idtarefa: number, tarefa: Tarefa): Observable<any> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/detalhes/${idprojeto}/${idtarefa}`, tarefa, { headers }).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getTempoRegistrado(idProjeto: number, idTarefa: number) {
    return this.http.get<{ tempoRegistrado: number }>(`${this.apiUrl}/${idTarefa}/tempo-registrado`);
  }

  registrarTempo(tarefaId: number, horas: number): Observable<Tarefa> {
    const payload = {
      horas: horas
    };

    return this.http.post<Tarefa>(`${this.apiUrl}/${tarefaId}/registrar-tempo`, payload);
  }

  getTodasTarefas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl);
  }

  getTarefasPorUsuario(usuarioId: number): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.apiUrl}/usuario/${usuarioId}`).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }

  getTarefasPorProjetoDoUsuario(usuarioId: number): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.apiUrl}/projetos-usuario/${usuarioId}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
