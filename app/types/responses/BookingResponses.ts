import { ApiErrorCodesEnum, BookingStatus } from "../enums";
import { RoomType } from "../enums/RoomType";

export interface CreateBookingResponse {
  bookingId?: number;
  bookingStatus?: BookingStatus;
  checkIn?: string;
  checkOut?: string;
  error?: string;
  errorCode?: ApiErrorCodesEnum;
}

export interface Booking {
  checkIn?: string;
  checkOut?: string;
  pricePerNight?: number;
  roomNumber?: number;
  roomType?: RoomType;
  bookingStatus?: BookingStatus;
  bookingId?: number;
  expiresAt?: string;
}

export interface GetBookingsResponse {
  bookings?: Booking[];
  error?: string;
  errorCode?: ApiErrorCodesEnum;
}
