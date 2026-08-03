import { useMutation } from "@tanstack/react-query";
import { Signup } from "../services";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../lib";
import { setUser } from "../lib/slices/UserSlice";

export const useSignup = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: Signup,
    onSuccess: (data) => {
      router.push("/Login");
      dispatch?.(setUser?.(data));
    },
  });
};
