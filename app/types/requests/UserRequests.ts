export interface CreateUserRequest {
  name: string;
  userName: string;
  password: string;
}

export interface LoginUserRequest {
  userName: string;
  password: string;
}

export interface VerifyOTPRequest {
  userId: number;
  userName: string;
  OTP: string;
}

export interface VerifyEmailRequest {
  userName: string;
  name: string;
}
