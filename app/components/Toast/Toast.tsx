import { CONFIGS } from "@/app/configs";
import { ToastType } from "@/app/types/enums/ToastEnums";
import { Bounce, toast, ToastOptions } from "react-toastify";

export const showToast = (message: string, type: string) => {
  const { position, transition, theme } = CONFIGS?.TOAST_CONFIG || {};
  const config: ToastOptions = {
    position: position || "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    theme: theme || "light",
    transition: transition || Bounce,
    progress: undefined
  };

  switch (type) {
    case ToastType.SUCCESS:
      toast.success(message, config);
      break;
    case ToastType.ERROR:
      toast.error(message, config);
      break;
    case ToastType.INFO:
      toast.info(message, config);
      break;
    case ToastType.WARNING:
      toast.warning(message, config);
      break;
    default:
      toast(message, config);
  }
};
