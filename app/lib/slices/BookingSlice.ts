import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingState } from "../types";
import { Booking } from "@/app/types";
import { RootState } from "../store";

const initialState: BookingState = {
  selectedBooking: undefined,
};

const bookingSlice = createSlice({
  name: "bookingReducer",
  initialState,
  reducers: {
    setSelectedBooking: (state, action: PayloadAction<Booking | undefined>) => {
      state.selectedBooking = action.payload;
    },
  },
});

export const { setSelectedBooking } = bookingSlice.actions;

export const selectBooking = (state: RootState) => state?.bookingReducer;
export const bookingReducer = bookingSlice.reducer;
