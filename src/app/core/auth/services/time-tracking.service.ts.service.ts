import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {

  private apiUrl = 'http://localhost:8080/api/lancamento';  // Corrigido para o endpoint correto

  constructor(private http: HttpClient) { }

  saveLancamento(lancamento: any): Observable<any> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      return throwError('Token de autenticação não encontrado');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(this.apiUrl, lancamento, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao salvar lançamento de horas', error);
        return throwError(error);
      })
    );
  }
}
