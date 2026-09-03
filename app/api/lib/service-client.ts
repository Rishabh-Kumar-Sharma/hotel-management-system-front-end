import { cookies } from "next/headers";
import { ApiMessageTypes } from "../types/ApiMessageTypes";
import { OperationTypes } from "../types/OperationTypes";
import { NextResponse } from "next/server";

const getAuthHeaders = async () => {
  const authToken = (await cookies())?.get("authToken")?.value;
  return {
    "Content-Type": "application/json",
    ...(authToken && {
      Authorization: `Bearer ${authToken}`,
    }),
  };
};

export const fetchData = (
  url: string,
  bodyData?: any,
  method: OperationTypes = OperationTypes.POST,
  apiFallBackMessage?: string
) => {
  switch (method) {
    case OperationTypes.POST:
      return fetchPost(url, bodyData, apiFallBackMessage);
    case OperationTypes.DELETE:
      return deleteData(url, apiFallBackMessage);
    case OperationTypes.GET:
      return fetchGet(url, apiFallBackMessage);
    default:
      throw new Error(ApiMessageTypes.INVALID_OPERATION_TYPE);
  }
};

const fetchGet = async (url: string, apiFallBackMessage?: string) => {
  try {
    const res = await fetch(url, {
      method: OperationTypes.GET,
      headers: await getAuthHeaders(),
    });
    const data = await res?.json();
    if (res?.ok) {
      return new NextResponse(JSON.stringify(data), {
        status: res?.status || 200,
      });
    } else {
      return new NextResponse(
        JSON.stringify({
          error:
            data?.message ||
            apiFallBackMessage ||
            ApiMessageTypes.INTERNAL_SERVER_ERROR,
          errorCode: data?.errorCode || "INTERNAL_SERVER_ERROR",
        }),
        {
          status: res?.status || 500,
        },
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: error || ApiMessageTypes.INTERNAL_SERVER_ERROR,
      }),
      {
        status: 500,
      },
    );
  }
};

const fetchPost = async (
  url: string,
  bodyData: any,
  apiFallBackMessage?: string,
) => {
  try {
    const res = await fetch(url, {
      method: OperationTypes.POST,
      headers: await getAuthHeaders(),
      body: JSON.stringify(bodyData || {}),
    });
    const data = await res?.json();
    if (res?.ok) {
      return new NextResponse(JSON.stringify(data), {
        status: res?.status || 200,
      });
    } else {
      return new NextResponse(
        JSON.stringify({
          error:
            data?.message ||
            apiFallBackMessage ||
            ApiMessageTypes.INTERNAL_SERVER_ERROR,
          errorCode: data?.errorCode || "INTERNAL_SERVER_ERROR",
        }),
        {
          status: res?.status || 500,
        },
      );
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        error: error || ApiMessageTypes.INTERNAL_SERVER_ERROR,
      }),
      {
        status: 500,
      },
    );
  }
};

const deleteData = async (
  URL: string,
  apiFallBackMessage?: string
) => {
  try {
    const res = await fetch(URL, {
      method: OperationTypes.DELETE,
      headers: await getAuthHeaders(),
    });
    const data = await res?.json();
    if (res?.ok) {
      return new Response(JSON.stringify(data), { status: res?.status || 200 });
    } else {
      return new Response(
        JSON.stringify({
          error:
            data?.message ||
            apiFallBackMessage ||
            ApiMessageTypes.INTERNAL_SERVER_ERROR,
          errorCode: data?.errorCode || "INTERNAL_SERVER_ERROR",
        }),
        {
          status: res?.status || 500,
        },
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error || ApiMessageTypes.INTERNAL_SERVER_ERROR }),
      {
        status: 500,
      },
    );
  }
};
