import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
