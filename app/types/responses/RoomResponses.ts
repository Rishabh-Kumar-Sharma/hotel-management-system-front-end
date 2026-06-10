import { ApiErrorCodesEnum } from "../enums/ApiErrorCodesEnum";

export interface FetchAvailableRoomsResponse {
  rooms: Room[];
  error?: string;
  errorCode?: ApiErrorCodesEnum;
}

export interface Room {
  id: number;
  roomNumber: number;
  capacity: number;
  pricePerNight: number;
  roomType: string;
}
