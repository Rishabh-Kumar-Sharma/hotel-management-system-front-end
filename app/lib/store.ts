import { configureStore } from "@reduxjs/toolkit";
import * as reducers from "@/app/lib/slices";

export const makeStore = () => {
  return configureStore({
    reducer: reducers,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
