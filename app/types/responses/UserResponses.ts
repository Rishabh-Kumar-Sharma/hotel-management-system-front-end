export interface LoginUserResponse {
  authToken: string;
  id: number;
  userName: string;
  contactNo: string;
  error?: string;
  errorCode?: string;
}

export interface CreateUserResponse {
  userName?: string;
  id?: number;
  error?: string;
  errorCode?: string;
}
