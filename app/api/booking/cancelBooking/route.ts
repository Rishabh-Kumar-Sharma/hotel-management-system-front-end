import { fetchData } from "../../lib";
import { ApiMessageTypes } from "../../types/ApiMessageTypes";
import { OperationTypes } from "../../types/OperationTypes";

export async function GET(request: Request) {
  const URL = `${process?.env?.BACK_END_URL}/api/bookings/cancelBooking`;
  const bookingId = request.headers.get("bookingId");

  const res = await fetchData(
    URL + "/" + bookingId,
    null,
    OperationTypes.GET,
    ApiMessageTypes.BOOKING_CANCEL_FAILED
  );
  const data = await res?.json();
  return new Response(JSON.stringify(data), {
    status: res?.status || 200,
  });
}
