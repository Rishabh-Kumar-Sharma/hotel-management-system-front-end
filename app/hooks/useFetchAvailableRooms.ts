import { useMutation } from "@tanstack/react-query";
import { fetchRooms } from "../services";
import { useAppDispatch } from "../lib";
import { setRoom } from "../lib/slices/RoomSlice";

export const useFetchAvailableRooms = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: fetchRooms,
    onSuccess: (data) => {
      dispatch(setRoom(data));
    },
    onError: () => {
      dispatch(setRoom(undefined));
    },
  });
};
