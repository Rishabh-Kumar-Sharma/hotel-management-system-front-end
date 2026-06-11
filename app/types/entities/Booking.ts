import { BookingStatus } from "../enums/BookingStatus";
import { RoomType } from "../enums/RoomType";

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
