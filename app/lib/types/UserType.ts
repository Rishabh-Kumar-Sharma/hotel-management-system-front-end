import { CreateUserResponse, LoginUserResponse } from "@/app/types";

export interface UserState {
  readonly user?: LoginUserResponse | CreateUserResponse;
}
