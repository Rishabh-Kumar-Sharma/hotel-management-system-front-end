import { Room } from "../entities";
import { RoomAvailabilityEnum } from "../enums";
import { ApiErrorCodesEnum } from "../enums/ApiErrorCodesEnum";
import { ErrorType } from "./BookingResponses";

export interface FetchAvailableRoomsResponse {
  rooms: Room[];
  error?: string;
  errorCode?: ApiErrorCodesEnum;
}

export interface TimeSlot {
  checkIn: string;
  checkOut: string;
}

export interface GetRoomAvailabilityResponse extends ErrorType {
  roomId: number;
  availability: RoomAvailabilityEnum;
  availableSlots: TimeSlot[];
}
