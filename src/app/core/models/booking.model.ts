export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'COMPLETED' | 'CANCELLED';

export interface Slot {
  id: number;
  instructorId: number;
  instructorName: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  examType: string;
  meetingRoomUrl?: string;
}

export interface Booking {
  id: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  slotId: number;
  instructorId: number;
  instructorName: string;
  examType: string;
  startTime: string;
  endTime: string;
  meetingRoomUrl: string;
  status: string;
  candidateNotes?: string;
  bookedAt: string;
}
