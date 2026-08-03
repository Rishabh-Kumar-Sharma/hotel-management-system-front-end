import { Booking } from "../entities";
import { ApiErrorCodesEnum, BookingStatus } from "../enums";

export interface ErrorType {
  error?: string;
  errorCode?: ApiErrorCodesEnum;
}

export interface CreateBookingResponse extends ErrorType {
  bookingId?: number;
  bookingStatus?: BookingStatus;
  checkIn?: string;
  checkOut?: string;
  amount?: number;
  currency?: string;
  orderId?: string;
  receiptId?: string;
}

export interface GetBookingsResponse extends ErrorType {
  bookings?: Booking[];
}

export interface RazorpayOrderResponse extends ErrorType {
  id?: string;
  amount?: string;
  currency?: string;
}

export interface ConfirmBookingResponse extends ErrorType {
  bookingId?: number;
  bookingStatus?: BookingStatus;
}

export interface CancelBookingResponse extends ErrorType {
  bookingId?: number;
  bookingStatus?: BookingStatus;
}
