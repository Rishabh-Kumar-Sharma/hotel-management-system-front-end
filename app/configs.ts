import { Bounce, ToastPosition } from "react-toastify";
import { ToastPositions, ToastTheme } from "./types/enums/ToastEnums";

export const CONFIGS = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  TOAST_CONFIG: {
    position: ToastPositions.TOP_CENTER as ToastPosition,
    autoClose: 5000,
    transition: Bounce,
    theme: ToastTheme.LIGHT,
  },
};
