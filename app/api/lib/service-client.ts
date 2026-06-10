import { ApiMessageTypes } from "../types/ApiMessageTypes";
import { OperationTypes } from "../types/OperationTypes";
import { NextResponse } from "next/server";

export const fetchData = (
  url: string,
  bodyData?: any,
  method: OperationTypes = OperationTypes.POST,
  apiFallBackMessage?: string,
  authToken?: string,
) => {
  switch (method) {
    case OperationTypes.POST:
      return fetchPost(url, bodyData, apiFallBackMessage, authToken);
    case OperationTypes.DELETE:
      return deleteData(url, apiFallBackMessage, authToken);
    case OperationTypes.GET:
      return fetchGet(url, apiFallBackMessage, authToken);
    default:
      throw new Error(ApiMessageTypes.INVALID_OPERATION_TYPE);
  }
};

const fetchGet = async (
  url: string,
  apiFallBackMessage?: string,
  authToken?: string,
) => {
  try {
    const res = await fetch(url, {
      method: OperationTypes.GET,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
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
  authToken?: string,
) => {
  try {
    const res = await fetch(url, {
      method: OperationTypes.POST,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && {
          Authorization: `Bearer ${authToken}`,
        }),
      },
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
  apiFallBackMessage?: string,
  authToken?: string,
) => {
  try {
    const res = await fetch(URL, {
      method: OperationTypes.DELETE,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
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
