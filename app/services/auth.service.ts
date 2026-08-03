import { CreateUserRequest, CreateUserResponse, LoginUserResponse } from "../types";

export async function fetchUserData(
  personDetails: any,
): Promise<LoginUserResponse> {
  const data = await fetch("api/user/login", {
    method: "POST",
    body: JSON.stringify({
      userName: personDetails?.email,
      password: personDetails?.password,
    }),
  });
  const parsedData = await data.json();

  return parsedData;
}

export async function fetchCurrentUser(): Promise<LoginUserResponse> {
  const data = await fetch("api/user/fetchCurrentUser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authToken: `${sessionStorage?.getItem("authToken")}`,
    },
  });

  const parsedRes = await data?.json();
  if (parsedRes?.error) {
    throw new Error(parsedRes.error);
  }

  return parsedRes;
}

export async function Signup(
  request: CreateUserRequest,
): Promise<CreateUserResponse> {
  const data = await fetch("/api/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  const parsedData: CreateUserResponse = await data?.json();

  if (parsedData?.error) {
    throw new Error(parsedData.error);
  }

  return parsedData;
}
