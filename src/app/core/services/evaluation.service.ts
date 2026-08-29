import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation, EvaluationGradePayload } from '../models/evaluation.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = 'http://localhost:8080/api/v1/evaluations';

  constructor(private http: HttpClient) {}

  gradeMockExam(payload: EvaluationGradePayload): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.apiUrl}/grade`, payload);
  }

  getStudentEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/student`);
  }

  getEvaluationByBookingId(bookingId: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/booking/${bookingId}`);
  }

  verifyCertificate(code: string): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/certificate/${code}`);
  }
}
