import { useMutation } from "@tanstack/react-query";
import { ResendOTP } from "../services";

export const useResendOTP = () => {
  return useMutation({
    mutationFn: ResendOTP,
  });
};
