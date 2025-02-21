import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:8080/email/send';  // URL do backend para enviar e-mails

  constructor(private http: HttpClient) {}

  sendContactEmail(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
