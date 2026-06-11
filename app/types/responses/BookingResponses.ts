import { Booking } from "../entities";
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

export interface GetBookingsResponse {
  bookings?: Booking[];
  error?: string;
  errorCode?: ApiErrorCodesEnum;
}
