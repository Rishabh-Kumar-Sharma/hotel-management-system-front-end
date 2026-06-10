import { BookingStatus } from "../enums/BookingStatus";

export interface Booking {
  bookingId: number;
  bookingStatus: BookingStatus;
  checkIn: string;
  checkOut: string;
}
