import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {
  private apiUrl = 'http://localhost:8080/api/lancamento';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro na operação';

    if (error.status === 401) {
      errorMessage = 'Sessão expirada ou usuário não autenticado';
    } else if (error.status === 403) {
      errorMessage = 'Você não tem permissão para acessar este recurso';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Erro do servidor: ${error.status}, mensagem: ${error.message}`;
    }

    console.error('Erro na requisição:', error);
    return throwError(() => errorMessage);
  }

  saveLancamento(lancamento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, lancamento, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getLancamentosByUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(lancamentos => lancamentos.map(lancamento => ({
        ...lancamento,
        data: new Date(lancamento.data).toISOString().split('T')[0],
        horaInicio: lancamento.horaInicio.substring(0, 5),
        horaFim: lancamento.horaFim.substring(0, 5)
      }))),
      catchError(this.handleError)
    );
  }

  // Método para buscar todos os lançamentos com status EM_ANALISE
  getLancamentosEmAnalise(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/em-analise`, {
      headers: this.getAuthHeaders()
    }).pipe(
      map(lancamentos => lancamentos.map(lancamento => ({
        ...lancamento,
        data: new Date(lancamento.data).toISOString().split('T')[0],
        horaInicio: lancamento.horaInicio.substring(0, 5),
        horaFim: lancamento.horaFim.substring(0, 5)
      }))),
      catchError(this.handleError)
    );
  }

  // Método para aprovar um lançamento
  aprovarLancamento(lancamentoId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/aprovar/${lancamentoId}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para rejeitar um lançamento
  rejeitarLancamento(lancamentoId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/rejeitar/${lancamentoId}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método genérico para atualizar o status de um lançamento
  atualizarStatus(lancamentoId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${lancamentoId}/status`, { status }, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
}
