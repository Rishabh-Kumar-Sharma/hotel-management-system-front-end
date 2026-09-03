export interface FetchAvailableRoomsRequest {
  checkIn: string; // ISO format date string
  checkOut: string; // ISO format date string
}

export interface GetRoomAvailabilityRequest {
  roomNumber: number;
  checkIn: string;
  checkOut: string;
  bookingId: number;
}
