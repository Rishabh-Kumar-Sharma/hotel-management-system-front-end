import { ErrorType } from "./BookingResponses";

export interface LoginUserResponse extends ErrorType {
  id: number;
  userName: string;
  contactNo: string;
}

export interface CreateUserResponse extends ErrorType {
  userName?: string;
  id?: number;
  isOTPSent?: boolean;
  name?: string;
}

export interface VerifyOTPResponse extends ErrorType {
  verificationStatus?: boolean;
}

export interface VerifyEmailResponse extends ErrorType {
  isOTPSent?: boolean;
}
