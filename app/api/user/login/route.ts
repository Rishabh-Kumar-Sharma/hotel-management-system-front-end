import { fetchData } from "../../lib/service-client";
import { ApiMessageTypes } from "../../types/ApiMessageTypes";
import { OperationTypes } from "../../types/OperationTypes";

export async function POST(request: Request) {
  const URL = `${process?.env?.BACK_END_URL}/api/auth/login`;
  const bodyData = await request?.json();

  const res = await fetchData(
    URL,
    bodyData,
    OperationTypes.POST,
    ApiMessageTypes.SESSION_TIMEOUT,
  );
  const data = await res?.json();
  return new Response(JSON.stringify(data), {
    status: res?.status || 200,
  });
}
