import { useMutation } from "@tanstack/react-query";
import { bookRoom } from "../services";
import { ApiErrorCodesEnum } from "../types";
import { useRouter } from "next/navigation";

export const useBookRoom = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: bookRoom,
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
