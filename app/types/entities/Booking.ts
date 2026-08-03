import { BookingStatus, RoomType } from "../enums";

export interface Booking {
  checkIn?: string;
  checkOut?: string;
  pricePerNight?: number;
  roomNumber?: number;
  roomType?: RoomType;
  bookingStatus?: BookingStatus;
  bookingId?: number;
  expiresAt?: string;
  orderId?: string;
  paymentId?: string;
  currency?: string;
}
