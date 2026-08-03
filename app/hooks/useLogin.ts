import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUserData } from "../services";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../lib";
import { setUser } from "../lib/slices/UserSlice";

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchUserData,
    onSuccess: (data) => {
      if (data?.error) {
        // this means call to back-end was successful and
        // response also came back successfully but the user credentials were invalid
        return;
      }
      dispatch(setUser(data));
      sessionStorage?.setItem("authToken", data?.authToken);
      queryClient.setQueryData(["current-user"], data);
      router.push("/");
    },
  });
};
