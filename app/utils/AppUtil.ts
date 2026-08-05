import { useRouter } from "next/navigation";
import { useAppDispatch } from "../lib";
import { setUser } from "../lib/slices/UserSlice";

export const Logout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  sessionStorage.removeItem("authToken");
  dispatch(setUser(undefined));
  router.push("/Login");
};
