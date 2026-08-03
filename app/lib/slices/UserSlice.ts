import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserState } from "../types";
import { LoginUserResponse } from "@/app/types";

const initialState: UserState = {
  user: undefined,
};

const userSlice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginUserResponse | undefined>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.userReducer;
export default userSlice.reducer;
export const userReducer = userSlice.reducer;
