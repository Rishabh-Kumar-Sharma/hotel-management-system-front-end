import {
  ApiErrorCodesEnum,
  FetchAvailableRoomsRequest,
  FetchAvailableRoomsResponse,
  GetRoomAvailabilityRequest,
  GetRoomAvailabilityResponse,
} from "../types";

export const fetchRooms = async (
  request?: FetchAvailableRoomsRequest,
): Promise<FetchAvailableRoomsResponse> => {
  const res = await fetch("/api/room/fetchAvailableRooms", {
    method: "POST",
    body: JSON.stringify(request),
  });
  const data: FetchAvailableRoomsResponse = await res?.json();

  if (data?.error) {
    throw new Error(data?.error);
  }

  return data;
};

export const checkAvailability = async (
  request?: GetRoomAvailabilityRequest,
): Promise<GetRoomAvailabilityResponse> => {
  const res = await fetch("/api/room/checkAvailability", {
    method: "POST",
    body: JSON.stringify(request),
  });
  const data: GetRoomAvailabilityResponse = await res?.json();
  if (
    (data?.error &&
      data?.errorCode !== ApiErrorCodesEnum.UNAUTHORIZED_ACCESS) &&
    data?.errorCode !== ApiErrorCodesEnum.SESSION_TIMEOUT
  ) {
    throw new Error(data?.error);
  }
  return data;
};
