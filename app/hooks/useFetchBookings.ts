import { useQuery } from "@tanstack/react-query";
import { fetchBookings } from "../services";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ApiErrorCodesEnum } from "../types";

export const useFetchBookings = () => {
  const router = useRouter();

  const query = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (
      query.data?.errorCode === ApiErrorCodesEnum.UNAUTHORIZED_ACCESS ||
      query.data?.errorCode === ApiErrorCodesEnum.SESSION_TIMEOUT
    ) {
      router.replace("/Login");
    }
  }, [router, query.data]);

  return query;
};
