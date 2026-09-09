import {
  CreateUserRequest,
  CreateUserResponse,
  LoginUserResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "../types";
import { Translations } from "../utils";

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
    body: JSON.stringify(request),
  });
  const parsedData: CreateUserResponse = await data?.json();

  if (parsedData?.error) {
    throw new Error(parsedData.error);
  }

  return parsedData;
}

export async function VerifyOTP(
  request: VerifyOTPRequest,
): Promise<VerifyOTPResponse> {
  const data = await fetch("/api/user/verifyOTP", {
    method: "POST",
    body: JSON.stringify(request),
  });
  const parsedData: VerifyOTPResponse = await data?.json();

  if (parsedData?.error) {
    throw new Error(parsedData.error);
  }
  if (parsedData?.verificationStatus === false) {
    throw new Error(Translations.INVALID_OTP);
  }

  return parsedData;
}

export async function ResendOTP(
  request: VerifyEmailRequest,
): Promise<VerifyEmailResponse> {
  const data = await fetch("/api/user/resendOTP", {
    method: "POST",
    body: JSON.stringify(request),
  });
  const parsedData: VerifyEmailResponse = await data?.json();

  if (parsedData?.error) {
    throw new Error(parsedData.error);
  }

  return parsedData;
}
