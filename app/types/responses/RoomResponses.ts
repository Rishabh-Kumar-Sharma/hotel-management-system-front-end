import { Room } from "../entities";
import { ApiErrorCodesEnum } from "../enums/ApiErrorCodesEnum";

export interface FetchAvailableRoomsResponse {
  rooms: Room[];
  error?: string;
  errorCode?: ApiErrorCodesEnum;
}
