import { useMutation } from "@tanstack/react-query";
import { ApiErrorCodesEnum, UpdateBookingDetailsRequest } from "../types";
import { updateBookingDetails } from "../services";
import { useRouter } from "next/navigation";

export const useUpdateBooking = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: updateBookingDetails,
    onSuccess: (data) => {
      if (data?.error) {
        if (
          data?.errorCode === ApiErrorCodesEnum.UNAUTHORIZED_ACCESS ||
          data?.errorCode === ApiErrorCodesEnum.SESSION_TIMEOUT
        ) {
          router.push("/Login");
        }
      }
    },
  });
};
