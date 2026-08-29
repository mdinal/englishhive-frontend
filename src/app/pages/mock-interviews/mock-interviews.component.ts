import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Slot } from '../../core/models/booking.model';

@Component({
  selector: 'app-mock-interviews',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './mock-interviews.component.html',
  styleUrls: ['./mock-interviews.component.css']
})
export class MockInterviewsComponent implements OnInit {
  bookingService = inject(BookingService);
  authService = inject(AuthService);
  toast = inject(ToastService);
  router = inject(Router);

  slots = signal<Slot[]>([]);
  selectedSlot: Slot | null = null;
  candidateNotes = '';
  bookingLoading = false;

  ngOnInit() {
    this.loadSlots();
  }

  loadSlots() {
    this.bookingService.getAvailableSlots().subscribe(res => {
      this.slots.set(res);
    });
  }

  openBookingModal(slot: Slot) {
    if (!this.authService.isAuthenticated()) {
      this.toast.info('Sign In Required', 'Please sign in to reserve an examiner interview slot.');
      this.router.navigate(['/login']);
      return;
    }
    this.selectedSlot = slot;
  }

  confirmBooking() {
    if (!this.selectedSlot) return;
    this.bookingLoading = true;
    this.bookingService.bookSlot({
      slotId: this.selectedSlot.id,
      candidateNotes: this.candidateNotes,
      examType: this.selectedSlot.examType
    }).subscribe({
      next: booking => {
        this.bookingLoading = false;
        this.selectedSlot = null;
        this.toast.success('Interview Slot Confirmed', `Meeting room URL generated: ${booking.meetingRoomUrl}`);
        this.router.navigate(['/live-room'], { queryParams: { bookingId: booking.id } });
      },
      error: () => {
        this.bookingLoading = false;
        this.loadSlots();
      }
    });
  }
}
