import { useMutation } from "@tanstack/react-query";
import { bookRoomCancel } from "../services";
import { useRouter } from "next/navigation";
import { ApiErrorCodesEnum } from "../types";

export const useCancelBooking = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (bookingId: number) => bookRoomCancel(bookingId),
    onSuccess: (data) => {
      if (data?.error) {
        if (
          data.errorCode === ApiErrorCodesEnum.UNAUTHORIZED_ACCESS ||
          data.errorCode === ApiErrorCodesEnum.SESSION_TIMEOUT
        ) {
          router.push("/Login");
        }
      }
    },
  });
};
