import {
  FetchAvailableRoomsResponse,
  GetRoomAvailabilityResponse,
  TimeSlot,
} from "@/app/types";

export interface RoomState {
  readonly rooms?: FetchAvailableRoomsResponse;
  readonly roomFilter?: TimeSlot;
  readonly roomAvailabilityResponse?: GetRoomAvailabilityResponse;
}
