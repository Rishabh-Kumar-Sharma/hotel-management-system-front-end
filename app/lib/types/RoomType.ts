import { FetchAvailableRoomsResponse } from "@/app/types";

export interface RoomState {
  readonly rooms?: FetchAvailableRoomsResponse;
  readonly roomFilter?: RoomFilter;
}

export interface RoomFilter {
  checkIn: string;
  checkOut: string;
}
