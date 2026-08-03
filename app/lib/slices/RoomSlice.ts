import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RoomState } from "../types";
import { FetchAvailableRoomsResponse } from "@/app/types";
import { RootState } from "../store";

const initialState: RoomState = {
  rooms: undefined,
};
const roomSlice = createSlice({
  name: "roomReducer",
  initialState,
  reducers: {
    setRoom: (
      state,
      action: PayloadAction<FetchAvailableRoomsResponse | undefined>,
    ) => {
      state.rooms = action.payload;
    },
  },
});

export const { setRoom } = roomSlice.actions;

export const selectRoom = (state: RootState) => state.roomReducer;
export const roomReducer = roomSlice.reducer;
