import {
  FetchAvailableRoomsRequest,
  FetchAvailableRoomsResponse,
} from "../types";

export const fetchRooms = async (
  request?: FetchAvailableRoomsRequest,
): Promise<FetchAvailableRoomsResponse> => {
  const res = await fetch("/api/room/fetchAvailableRooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const data: FetchAvailableRoomsResponse = await res?.json();

  if (data?.error) {
    throw new Error(data?.error);
  }

  return data;
};
