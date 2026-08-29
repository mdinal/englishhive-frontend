import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, Slot } from '../models/booking.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getAvailableSlots(): Observable<Slot[]> {
    return this.http.get<Slot[]>(`${this.apiUrl}/slots/available`);
  }

  createSlot(slot: { startTime: string; endTime: string; examType: string }): Observable<Slot> {
    return this.http.post<Slot>(`${this.apiUrl}/slots`, slot);
  }

  bookSlot(booking: { slotId: number; candidateNotes?: string; examType?: string }): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/book`, booking);
  }

  getStudentBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/student`);
  }

  getInstructorBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/instructor`);
  }
}
