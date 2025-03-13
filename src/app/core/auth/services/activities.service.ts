import { environment } from './../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {
  private apiUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {}

  getActivities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createActivity(activity: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, activity);
  }

  getActivityById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateActivity(id: number, activity: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, activity);
  }

  deleteActivity(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
