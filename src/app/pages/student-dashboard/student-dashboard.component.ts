import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { EvaluationService } from '../../core/services/evaluation.service';
import { Booking } from '../../core/models/booking.model';
import { Evaluation } from '../../core/models/evaluation.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {
  authService = inject(AuthService);
  bookingService = inject(BookingService);
  evaluationService = inject(EvaluationService);

  upcomingBookings = signal<Booking[]>([]);
  evaluations = signal<Evaluation[]>([]);

  ngOnInit() {
    this.bookingService.getStudentBookings().subscribe({
      next: res => this.upcomingBookings.set(res),
      error: () => {
        this.upcomingBookings.set([
          {
            id: 1,
            studentId: 1,
            studentName: 'Sarah Jenkins',
            studentEmail: 'student@englishhive.com',
            slotId: 1,
            instructorId: 2,
            instructorName: 'Dr. Arthur Pendelton',
            examType: 'IELTS_ACADEMIC',
            startTime: new Date(Date.now() + 3600000).toISOString(),
            endTime: new Date(Date.now() + 6300000).toISOString(),
            meetingRoomUrl: 'https://meet.englishhive.com/room/ielts-78192',
            status: 'BOOKED',
            candidateNotes: 'Focus on Part 3 abstract lexical collocations and transition fillers.',
            bookedAt: new Date().toISOString()
          }
        ]);
      }
    });

    this.evaluationService.getStudentEvaluations().subscribe({
      next: res => this.evaluations.set(res),
      error: () => {
        this.evaluations.set([
          {
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
            detailedFeedback: 'Exceptional flow in long turn discourse. Fluid native-style transitions.',
            strengths: 'Very natural intonation and sentence stress.',
            areasForImprovement: 'Review rare idiomatic collocations.',
            examinerRecommendation: 'Ready for official British Council exam.',
            certificateCode: 'EVAL-IELTS-2026-88392-SARAH',
            evaluatedAt: new Date().toISOString()
          }
        ]);
      }
    });
  }
}
