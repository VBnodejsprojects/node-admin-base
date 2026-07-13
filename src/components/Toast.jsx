import { toast } from "react-toastify";

// custom toast options
const options = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "colored",
  progress: undefined,
};

export const ShowToast = {
  success: (message) => {
    toast.success(message, {
      ...options,
      toastClassName: "toastify-toast toastify-success",
    });
  },
  error: (message) => {
    toast.error(message, {
      ...options,
      toastClassName: "toastify-toast toastify-error",
    });
  },
  warning: (message) => {
    toast.warning(message, {
      ...options,
      toastClassName: "toastify-toast toastify-warning",
    });
  },
  info: (message) => {
    toast.info(message, {
      ...options,
      toastClassName: "toastify-toast toastify-info",
    });
  },
};
