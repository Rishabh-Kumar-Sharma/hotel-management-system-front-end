export interface LoginUserResponse {
  authToken: string;
  id: number;
  userName: string;
  contactNo: string;
  error?: string;
}
