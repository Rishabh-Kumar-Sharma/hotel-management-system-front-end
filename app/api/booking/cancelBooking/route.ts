import { fetchData } from "../../lib/service-client";
import { ApiMessageTypes } from "../../types/ApiMessageTypes";
import { OperationTypes } from "../../types/OperationTypes";

export async function GET(request: Request) {
  const URL = `${process?.env?.BACK_END_URL}/api/bookings/cancelBooking`;
  const authToken = request.headers.get("authToken");
  const bookingId = request.headers.get("bookingId");

  const res = await fetchData(
    URL + "/" + bookingId,
    null,
    OperationTypes.GET,
    ApiMessageTypes.BOOKING_CANCEL_FAILED,
    authToken || undefined,
  );
  const data = await res?.json();
  return new Response(JSON.stringify(data), {
    status: res?.status || 200,
  });
}
