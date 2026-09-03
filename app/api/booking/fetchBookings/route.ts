import { fetchData } from "../../lib/service-client";
import { ApiMessageTypes } from "../../types/ApiMessageTypes";
import { OperationTypes } from "../../types/OperationTypes";

export async function GET(request: Request) {
  const URL = `${process?.env?.BACK_END_URL}/api/bookings/getAllBookings`;

  const res = await fetchData(
    URL,
    null,
    OperationTypes.GET,
    ApiMessageTypes.NO_BOOKING_FOUND
  );
  const data = await res?.json();
  return new Response(JSON.stringify(data), {
    status: res?.status || 200,
  });
}
