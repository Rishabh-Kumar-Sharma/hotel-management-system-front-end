import { useMutation } from "@tanstack/react-query";
import { checkAvailability } from "../services";
import { ApiErrorCodesEnum, GetRoomAvailabilityRequest } from "../types";
import { useRouter } from "next/navigation";
import { setRoomAvailabilityResponse } from "../lib/slices/RoomSlice";
import { useAppDispatch } from "../lib";

export const useCheckAvailability = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationKey: ["checkAvailability"],
    mutationFn: (request?: GetRoomAvailabilityRequest) =>
      checkAvailability(request),
    onSuccess: (data) => {
      if (
        data?.errorCode === ApiErrorCodesEnum.UNAUTHORIZED_ACCESS ||
        data?.errorCode === ApiErrorCodesEnum.SESSION_TIMEOUT
      ) {
        router.replace("/Login");
      } else {
        dispatch(setRoomAvailabilityResponse(data));
      }
    },
  });
};
