import { cookies } from "next/headers";
import { fetchData } from "../../lib";
import { ApiMessageTypes } from "../../types/ApiMessageTypes";
import { OperationTypes } from "../../types/OperationTypes";

export async function GET() {
  const authToken = (await cookies())?.get("authToken")?.value;
  if (!authToken)
    return new Response(
      JSON.stringify({
        error: ApiMessageTypes.NO_USER_FOUND,
        errorCode: "BAD_REQUEST",
      }),
      {
        status: 401,
      },
    );
  const URL = `${process?.env?.BACK_END_URL}/api/auth/fetchCurrentUser`;

  const res = await fetchData(
    URL,
    null,
    OperationTypes.GET,
    ApiMessageTypes.NO_USER_FOUND,
  );
  const data = await res?.json();
  return new Response(JSON.stringify(data), {
    status: res?.status || 200,
  });
}
