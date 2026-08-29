import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Booking, Slot } from '../models/booking.model';
import { environment } from '../../../environments/environment';

export const DEFAULT_SLOTS: Slot[] = [
  {
    id: 1,
    instructorId: 2,
    instructorName: 'Dr. Arthur Pendelton',
    examType: 'IELTS_ACADEMIC',
    startTime: '2026-09-01T09:00:00Z',
    endTime: '2026-09-01T09:45:00Z',
    status: 'AVAILABLE',
    meetingRoomUrl: 'https://meet.englishhive.com/room/ielts-live-8901'
  },
  {
    id: 2,
    instructorId: 2,
    instructorName: 'Dr. Arthur Pendelton',
    examType: 'IELTS_ACADEMIC',
    startTime: '2026-09-01T11:00:00Z',
    endTime: '2026-09-01T11:45:00Z',
    status: 'AVAILABLE',
    meetingRoomUrl: 'https://meet.englishhive.com/room/ielts-live-8902'
  },
  {
    id: 3,
    instructorId: 4,
    instructorName: 'Prof. Helen Rostova',
    examType: 'PTE_ACADEMIC',
    startTime: '2026-09-01T14:30:00Z',
    endTime: '2026-09-01T15:15:00Z',
    status: 'AVAILABLE',
    meetingRoomUrl: 'https://meet.englishhive.com/room/pte-live-7422'
  },
  {
    id: 4,
    instructorId: 5,
    instructorName: 'Robert Sterling, MBA',
    examType: 'SPOKEN_ENGLISH',
    startTime: '2026-09-02T10:00:00Z',
    endTime: '2026-09-02T10:45:00Z',
    status: 'AVAILABLE',
    meetingRoomUrl: 'https://meet.englishhive.com/room/biz-live-9011'
  }
];

export const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Sarah Jenkins',
    studentEmail: 'sarah.jenkins@oxford-prep.edu',
    slotId: 1,
    instructorId: 2,
    instructorName: 'Dr. Arthur Pendelton',
    examType: 'IELTS Academic Speaking',
    startTime: '2026-09-01T09:00:00Z',
    endTime: '2026-09-01T09:45:00Z',
    status: 'CONFIRMED',
    meetingRoomUrl: 'https://meet.englishhive.com/room/ielts-live-8901',
    candidateNotes: 'Focusing on eliminating hesitations in Part 2 and expanding abstract idioms in Part 3.',
    bookedAt: '2026-08-30T02:00:00Z'
  }
];

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getAvailableSlots(): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.apiUrl}/slots/available`).pipe(
      catchError(() => of(DEFAULT_SLOTS))
    );
  }

  createSlot(slot: { startTime: string; endTime: string; examType: string }): Observable<Slot> {
    return this.http.post<Slot>(`${this.apiUrl}/slots`, slot).pipe(
      catchError(() => {
        const newSlot: Slot = {
          id: Date.now(),
          instructorId: 2,
          instructorName: 'Dr. Arthur Pendelton',
          examType: slot.examType,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'AVAILABLE',
          meetingRoomUrl: `https://meet.englishhive.com/room/slot-${Date.now()}`
        };
        DEFAULT_SLOTS.unshift(newSlot);
        return of(newSlot);
      })
    );
  }

  bookSlot(booking: { slotId: number; candidateNotes?: string; examType?: string }): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/book`, booking).pipe(
      catchError(() => {
        const slot = DEFAULT_SLOTS.find(s => s.id === booking.slotId) || DEFAULT_SLOTS[0];
        slot.status = 'BOOKED';
        const newBooking: Booking = {
          id: Date.now(),
          studentId: 1,
          studentName: 'Sarah Jenkins',
          studentEmail: 'sarah.jenkins@oxford-prep.edu',
          slotId: slot.id,
          instructorId: slot.instructorId,
          instructorName: slot.instructorName,
          examType: slot.examType,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: 'CONFIRMED',
          meetingRoomUrl: slot.meetingRoomUrl || `https://meet.englishhive.com/room/mock-${Date.now()}`,
          candidateNotes: booking.candidateNotes,
          bookedAt: new Date().toISOString()
        };
        DEFAULT_BOOKINGS.unshift(newBooking);
        return of(newBooking);
      })
    );
  }

  getStudentBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/student`).pipe(
      catchError(() => of(DEFAULT_BOOKINGS))
    );
  }

  getInstructorBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/instructor`).pipe(
      catchError(() => of(DEFAULT_BOOKINGS))
    );
  }
}
