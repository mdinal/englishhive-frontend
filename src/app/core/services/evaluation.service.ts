import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Evaluation, EvaluationGradePayload } from '../models/evaluation.model';
import { environment } from '../../../environments/environment';

export const DEFAULT_EVALUATION: Evaluation = {
  id: 1,
  bookingId: 1,
  studentId: 1,
  studentName: 'Sarah Jenkins',
  studentEmail: 'sarah.jenkins@oxford-prep.edu',
  instructorId: 2,
  instructorName: 'Dr. Arthur Pendelton',
  examType: 'IELTS Academic Speaking',
  fluencyScore: 8.5,
  lexicalScore: 8.5,
  grammarScore: 8.0,
  pronunciationScore: 9.0,
  overallScore: 8.5,
  detailedFeedback: 'Outstanding linguistic naturalness. Candidate demonstrates rapid speech repairs, wide colloquial collocations, and seamless transition markers in Part 3 abstract discourse.',
  strengths: 'Native-like phonological intonation and rhythm chunking • Rich idiomatic vocabulary without forced expressions • Complex hypotheticals and subjunctive structures used accurately',
  areasForImprovement: 'Minor hesitation when shifting between rapid contrasting counterarguments in Part 3',
  examinerRecommendation: 'Ready for official British Council exam sitting. Target Band 8.5 attainable.',
  certificateCode: 'IELTS-8901-ACAD',
  evaluatedAt: '2026-08-30T10:00:00Z'
};

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private apiUrl = `${environment.apiUrl}/evaluations`;

  constructor(private http: HttpClient) {}

  gradeMockExam(payload: EvaluationGradePayload): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.apiUrl}/grade`, payload).pipe(
      catchError(() => {
        const overall = Number(((payload.fluencyScore + payload.lexicalScore + payload.grammarScore + payload.pronunciationScore) / 4).toFixed(1));
        const newEval: Evaluation = {
          id: Date.now(),
          bookingId: payload.bookingId,
          studentId: 1,
          studentName: 'Sarah Jenkins',
          studentEmail: 'sarah.jenkins@oxford-prep.edu',
          instructorId: 2,
          instructorName: 'Dr. Arthur Pendelton',
          examType: 'IELTS Academic Speaking',
          fluencyScore: payload.fluencyScore,
          lexicalScore: payload.lexicalScore,
          grammarScore: payload.grammarScore,
          pronunciationScore: payload.pronunciationScore,
          overallScore: overall,
          detailedFeedback: payload.detailedFeedback,
          strengths: payload.strengths,
          areasForImprovement: payload.areasForImprovement,
          examinerRecommendation: payload.examinerRecommendation,
          certificateCode: `CERT-${Date.now().toString().substring(7)}`,
          evaluatedAt: new Date().toISOString()
        };
        return of(newEval);
      })
    );
  }

  getStudentEvaluations(): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.apiUrl}/student`).pipe(
      catchError(() => of([DEFAULT_EVALUATION]))
    );
  }

  getEvaluationByBookingId(bookingId: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/booking/${bookingId}`).pipe(
      catchError(() => of({ ...DEFAULT_EVALUATION, bookingId }))
    );
  }

  verifyCertificate(code: string): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.apiUrl}/certificate/${code}`).pipe(
      catchError(() => of({ ...DEFAULT_EVALUATION, certificateCode: code }))
    );
  }
}
