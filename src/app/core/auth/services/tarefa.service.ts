import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
