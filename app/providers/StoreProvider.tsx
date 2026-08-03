"use client";

import { useState } from "react";
import { AppStore, makeStore } from "../lib";
import { Provider } from "react-redux";

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState<AppStore>(makeStore);

  return <Provider store={store}>{children}</Provider>;
};
