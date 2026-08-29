import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { EvaluationService } from '../../core/services/evaluation.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-live-room',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './live-room.component.html',
  styleUrls: ['./live-room.component.css']
})
export class LiveRoomComponent implements OnInit, OnDestroy {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  evaluationService = inject(EvaluationService);
  toast = inject(ToastService);

  bookingId = signal<number>(1);
  currentPart = signal<string>('Part 2: Long Turn');

  isMicMuted = false;
  isCamMuted = false;
  submitLoading = false;

  fluencyScore = 8.0;
  lexicalScore = 7.5;
  grammarScore = 8.0;
  pronunciationScore = 8.0;
  detailedFeedback = 'Candidate spoke at length without noticeable hesitation. Natural connective markers and nuanced academic vocabulary used appropriately.';

  timerSeconds = 120;
  private timerInterval: any;
  formattedTimer = signal<string>('02:00');

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['bookingId']) {
        this.bookingId.set(Number(params['bookingId']));
      }
    });

    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
        const mins = Math.floor(this.timerSeconds / 60);
        const secs = this.timerSeconds % 60;
        this.formattedTimer.set(`${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  setPart(partName: string) {
    this.currentPart.set(partName);
    if (partName.includes('Part 2')) {
      this.timerSeconds = 120;
    } else {
      this.timerSeconds = 300;
    }
  }

  submitEvaluation() {
    this.submitLoading = true;
    this.evaluationService.gradeMockExam({
      bookingId: this.bookingId(),
      fluencyScore: this.fluencyScore,
      lexicalScore: this.lexicalScore,
      grammarScore: this.grammarScore,
      pronunciationScore: this.pronunciationScore,
      detailedFeedback: this.detailedFeedback,
      strengths: 'Excellent pacing, spontaneous idiomatic answers, very clear phonological intonation.',
      areasForImprovement: 'Practice Part 3 abstract speculative vocabulary to push from Band 8.0 to Band 8.5+.',
      examinerRecommendation: 'Ready for official British Council / IDP IELTS test booking.'
    }).subscribe({
      next: evaluation => {
        this.submitLoading = false;
        this.toast.success('Exam Evaluated', `Official Scorecard generated: Band ${evaluation.overallScore}`);
        this.router.navigate(['/scorecard-report'], { queryParams: { bookingId: evaluation.bookingId } });
      },
      error: () => {
        this.submitLoading = false;
        this.router.navigate(['/scorecard-report'], { queryParams: { bookingId: 1 } });
      }
    });
  }

  endSession() {
    this.router.navigate(['/mock-interviews']);
  }
}
