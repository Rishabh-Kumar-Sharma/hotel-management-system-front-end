import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../services";

export const useFetchCurrentUser = () => {

  return useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    retry: false,
    enabled: true,
    staleTime: Infinity,
    gcTime: Infinity,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
