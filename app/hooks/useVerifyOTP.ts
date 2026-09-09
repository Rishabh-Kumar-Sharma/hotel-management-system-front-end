import { useMutation } from "@tanstack/react-query";
import { VerifyOTP } from "../services";
import { useRouter } from "next/navigation";

export const useVerifyOTP = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: VerifyOTP,
    onSuccess: () => {
      router.push("/Login");
    },
  });
};
