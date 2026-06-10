export interface CreateUserRequest {
  name: string;
  userName: string;
  password: string;
}

export interface LoginUserRequest {
  userName: string;
  password: string;
}