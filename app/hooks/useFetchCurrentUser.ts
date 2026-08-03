import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../services";

export const useFetchCurrentUser = () => {
  const token =
    typeof window !== "undefined" ? sessionStorage.getItem("authToken") : null;

  return useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    retry: false,
    enabled: !!token,
    staleTime: Infinity,
    gcTime: Infinity,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
