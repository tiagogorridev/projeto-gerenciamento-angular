import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = `${environment.apiUrl}/send`;

  constructor(private http: HttpClient) {}

  sendContactEmail(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
