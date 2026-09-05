import { fetchData } from "../../lib";
import { ApiMessageTypes } from "../../types/ApiMessageTypes";
import { OperationTypes } from "../../types/OperationTypes";

export async function GET() {
  const URL = `${process?.env?.BACK_END_URL}/api/auth/fetchCurrentUser`;

  const res = await fetchData(
    URL,
    null,
    OperationTypes.GET,
    ApiMessageTypes.NO_USER_FOUND
  );
  const data = await res?.json();
  return new Response(JSON.stringify(data), {
    status: res?.status || 200,
  });
}
