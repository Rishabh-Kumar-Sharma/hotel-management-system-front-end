import { cookies } from "next/headers";
import { fetchData } from "../../lib";
import { ApiMessageTypes } from "../../types/ApiMessageTypes";
import { OperationTypes } from "../../types/OperationTypes";

export async function POST(request: Request) {
  const URL = `${process.env.BACK_END_URL}/api/auth/login`;
  const bodyData = await request.json();

  const res = await fetchData(
    URL,
    bodyData,
    OperationTypes.POST,
    ApiMessageTypes.SESSION_TIMEOUT,
  );

  const data = await res.json();

  if (data?.error) {
    return new Response(JSON.stringify(data), {
      status: res.status || 400,
    });
  }

  const { authToken, ...responseData } = data || {};

  if (!authToken) {
    return new Response(
      JSON.stringify({
        error: responseData?.errorCode || ApiMessageTypes.INTERNAL_SERVER_ERROR,
      }),
      {
        status: 500,
      },
    );
  }

  const cookieStore = await cookies();

  cookieStore.set("authToken", authToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Next.js sets this value automatically
    sameSite: "strict",
    path: "/",
  });

  return new Response(JSON.stringify(responseData), {
    status: res.status || 200,
  });
}
