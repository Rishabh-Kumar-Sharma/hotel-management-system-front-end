import { fetchData } from "../../lib";
import { ApiMessageTypes } from "../../types/ApiMessageTypes";
import { OperationTypes } from "../../types/OperationTypes";

export async function POST(request: Request) {
  const URL = `${process?.env?.BACK_END_URL}/api/bookings/updateBooking`;
  const bodyData = await request?.json();

  const res = await fetchData(
    URL,
    bodyData,
    OperationTypes.POST,
    ApiMessageTypes.BOOKING_NOT_CONFIRMED
  );
  const data = await res?.json();
  return new Response(JSON.stringify(data), {
    status: res?.status || 200,
  });
}
