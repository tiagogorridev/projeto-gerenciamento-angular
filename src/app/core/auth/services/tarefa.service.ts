import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Tarefa } from './tarefa.model';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  private apiUrl = 'http://localhost:8080/api/tarefas';

  constructor(private http: HttpClient) {}

  getProjectTasks(projectId: string) {
    return this.http.get<Tarefa[]>(`/api/projetos/${projectId}/tarefas`);
  }

  // tarefa.service.ts
  getProjectTasksUsers(projectId: string): Observable<Tarefa[]> {
    const url = `${this.apiUrl}/projetos/${projectId}/tarefas`;
    return this.http.get<Tarefa[]>(url).pipe(
      tap(response => console.log('Resposta do serviço:', response)),
      catchError(error => {
        console.error('Erro no serviço:', error);
        return throwError(error);
      })
    );
  }

  getTarefaDetails(idprojeto: number, idtarefa: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/detalhes/${idprojeto}/${idtarefa}`).pipe(
      tap(response => {
        console.log('Resposta da API:', response);
      }),
      catchError(error => {
        console.error('Erro no serviço:', error);
        return throwError(error);
      })
    );
  }

  atualizarTarefa(idprojeto: number, idtarefa: number, tarefa: Tarefa): Observable<any> {
    const token = localStorage.getItem('auth_token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/detalhes/${idprojeto}/${idtarefa}`, tarefa, { headers }).pipe(
      tap(response => {
        console.log('Tarefa atualizada:', response);
      }),
      catchError(error => {
        console.error('Erro ao atualizar tarefa:', error);
        return throwError(error);
      })
    );
  }

  deleteTarefa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getTempoRegistrado(idProjeto: number, idTarefa: number) {
    return this.http.get<{ tempoRegistrado: number }>(`${this.apiUrl}/${idTarefa}/tempo-registrado`);
  }

  getTodasTarefas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl);
  }

  registrarTempo(tarefaId: number, horas: number): Observable<Tarefa> {
    const payload = {
      horas: horas
    };

    return this.http.post<Tarefa>(`${this.apiUrl}/${tarefaId}/registrar-tempo`, payload)
      .pipe(
        tap((tarefaAtualizada: Tarefa) => {
          // Log to verify the backend is returning the custoRegistrado correctly
          console.log('Tarefa atualizada após registro de tempo:', tarefaAtualizada);
        })
      );
  }

  getTarefasPorUsuario(usuarioId: number): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.apiUrl}/usuario/${usuarioId}`).pipe(
      tap(tarefas => console.log('Tarefas recuperadas:', tarefas)),
      catchError(error => {
        console.error('Erro ao obter tarefas do usuário:', error);
        return throwError(error);
      })
    );
  }

  getTarefasPorProjetoDoUsuario(usuarioId: number): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(`${this.apiUrl}/projetos-usuario/${usuarioId}`).pipe(
      tap(tarefas => console.log('Tarefas dos projetos do usuário recuperadas:', tarefas)),
      catchError(error => {
        console.error('Erro ao obter tarefas dos projetos do usuário:', error);
        return throwError(() => error);
      })
    );
  }
}
