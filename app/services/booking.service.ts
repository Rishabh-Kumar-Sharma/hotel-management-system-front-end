import {
  ApiErrorCodesEnum,
  CancelBookingResponse,
  ConfirmBookingResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  GetBookingsResponse,
} from "../types";

export const bookRoom = async (
  request?: CreateBookingRequest,
): Promise<CreateBookingResponse> => {
  const res = await fetch("/api/booking/bookRoom", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authToken: `${sessionStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(request),
  });
  const data: CreateBookingResponse = await res?.json();
  return data;
};

export const fetchBookings = async (): Promise<GetBookingsResponse> => {
  const response = await fetch("/api/booking/fetchBookings", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: `${sessionStorage.getItem("authToken")}`,
    },
  });

  return await response.json();
};

export const bookRoomConfirm = async (
  request: any,
): Promise<ConfirmBookingResponse> => {
  const res = await fetch("/api/booking/bookRoomConfirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authToken: `${sessionStorage.getItem("authToken")}`,
    },
    body: JSON.stringify(request),
  });

  const data: ConfirmBookingResponse = await res?.json();

  if (data?.error) {
    throw new Error(data?.error);
  }

  return data;
};

export const bookRoomCancel = async (
  bookingId: number,
): Promise<CancelBookingResponse> => {
  const res = await fetch("/api/booking/cancelBooking", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: `${sessionStorage.getItem("authToken")}`,
      bookingId: `${bookingId}`,
    },
  });
  return await res?.json();
};
