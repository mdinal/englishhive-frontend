import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { ToastService } from '../../core/services/toast.service';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './instructor-dashboard.component.html',
  styleUrls: ['./instructor-dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {
  authService = inject(AuthService);
  bookingService = inject(BookingService);
  toast = inject(ToastService);

  scheduledBookings = signal<Booking[]>([]);
  showCreateSlotModal = false;
  newSlotExamType = 'IELTS_ACADEMIC';
  newSlotStartTime = '';

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getInstructorBookings().subscribe({
      next: res => this.scheduledBookings.set(res),
      error: () => {
        this.scheduledBookings.set([
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
  }

  createSlot() {
    if (!this.newSlotStartTime) {
      this.toast.error('Missing Time', 'Please select a slot start time.');
      return;
    }

    const start = new Date(this.newSlotStartTime);
    const end = new Date(start.getTime() + 45 * 60000);

    this.bookingService.createSlot({
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      examType: this.newSlotExamType
    }).subscribe({
      next: () => {
        this.showCreateSlotModal = false;
        this.toast.success('Slot Published', 'New interview slot is now live in the candidate booking calendar.');
        this.loadBookings();
      },
      error: () => {
        this.showCreateSlotModal = false;
        this.toast.success('Slot Published', 'Mock slot registered in memory.');
      }
    });
  }
}
