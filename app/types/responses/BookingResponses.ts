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
  bookings?: [
    {
      checkIn?: string;
      checkOut?: string;
      pricePerNight?: number;
      roomNumber?: number;
      roomType?: RoomType;
      bookingStatus?: BookingStatus;
      bookingId?: number;
      expiresAt?: string;
    },
  ];
  error?: string;
  errorCode?: ApiErrorCodesEnum;
}
