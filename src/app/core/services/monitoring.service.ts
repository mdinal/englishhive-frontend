import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemHealth } from '../models/monitoring.model';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private apiUrl = 'http://localhost:8080/api/v1/monitoring';

  constructor(private http: HttpClient) {}

  getHealthOverview(): Observable<SystemHealth> {
    return this.http.get<SystemHealth>(`${this.apiUrl}/health-overview`);
  }
}
