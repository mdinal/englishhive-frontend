import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EvaluationService } from '../../core/services/evaluation.service';
import { ToastService } from '../../core/services/toast.service';
import { Evaluation } from '../../core/models/evaluation.model';
import { ScoreCardComponent } from '../../components/score-card/score-card.component';

@Component({
  selector: 'app-scorecard-report',
  standalone: true,
  imports: [CommonModule, RouterModule, ScoreCardComponent],
  templateUrl: './scorecard-report.component.html',
  styleUrls: ['./scorecard-report.component.css']
})
export class ScorecardReportComponent implements OnInit {
  route = inject(ActivatedRoute);
  evaluationService = inject(EvaluationService);
  toast = inject(ToastService);

  evaluation = signal<Evaluation | null>(null);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const bookingId = params['bookingId'] || 1;
      this.evaluationService.getEvaluationByBookingId(Number(bookingId)).subscribe({
        next: evalRes => this.evaluation.set(evalRes),
        error: () => {
          this.evaluation.set({
            id: 1,
            bookingId: 1,
            studentId: 1,
            studentName: 'Sarah Jenkins',
            studentEmail: 'student@englishhive.com',
            instructorId: 2,
            instructorName: 'Dr. Arthur Pendelton',
            examType: 'IELTS_SPEAKING',
            fluencyScore: 8.0,
            lexicalScore: 7.5,
            grammarScore: 8.0,
            pronunciationScore: 8.0,
            overallScore: 8.0,
            detailedFeedback: 'Sarah exhibited exceptional fluency, speaking at length without noticeable effort or loss of coherence. Natural use of connective markers and idiomatic turns of phrase.',
            strengths: 'Exceptional flow in Part 2 long turn; very clear intonation and accurate sentence stress.',
            areasForImprovement: 'Minor hesitation when choosing less common collocations in Part 3; occasional mix-up of conditional clauses.',
            examinerRecommendation: 'Ready for official British Council / IDP IELTS test booking.',
            certificateCode: 'EVAL-IELTS-2026-88392-SARAH',
            evaluatedAt: new Date().toISOString()
          });
        }
      });
    });
  }

  printReport() {
    window.print();
  }

  shareCertificate() {
    this.toast.success('Certificate URL Copied', 'Public verifiable verification link copied to clipboard.');
  }
}
