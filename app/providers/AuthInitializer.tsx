"use client";
import { useEffect } from "react";
import { useFetchCurrentUser } from "../hooks/useFetchCurrentUser";
import { useAppDispatch } from "../lib";
import { setUser } from "../lib/slices/UserSlice";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isError, isSuccess } = useFetchCurrentUser();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(data));
    }
    if (isError) {
      sessionStorage.removeItem("authToken");
      dispatch(setUser(undefined));
    }
  }, [isSuccess, isError, data, dispatch]);
  return children;
}
