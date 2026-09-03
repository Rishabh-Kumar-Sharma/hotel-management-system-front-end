import { TimeSlot } from "../responses";

export interface CreateBookingRequest {
  roomId: number;
  checkIn: string; // ISO format date string
  checkOut: string; // ISO format date string
}

export interface UpdateBookingDetailsRequest extends TimeSlot {
  bookingId: number;
}
