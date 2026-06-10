import { fetchData } from "../../lib/service-client";
import { ApiMessageTypes } from "../../types/ApiMessageTypes";
import { OperationTypes } from "../../types/OperationTypes";

export async function DELETE(request: Request) {
  const body = await request?.json();
  const id = body?.id;
  const URL = `${process?.env?.BACK_END_URL}/api/customers/deleteCustomer/${id}`;

  const res = await fetchData(
    URL,
    {},
    OperationTypes.DELETE,
    ApiMessageTypes.CUSTOMER_NOT_CREATED,
  );
  const data = await res?.json();
  return new Response(JSON.stringify(data), {
    status: res?.status || 200,
  });
}
