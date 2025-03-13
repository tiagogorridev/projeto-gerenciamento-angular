import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://sistema-horas-a6e4955506b7.herokuapp.com/api/send';

  constructor(private http: HttpClient) {}

  sendContactEmail(formData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
