import { ToastContainer, Zoom, toast } from "react-toastify";

const Toast = () => {

  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      transition={Zoom}
    />
  );
}

export default Toast;

export const showToast = (type = "info", message) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      const errorMessage = message || "Something went wrong";
      toast.error(errorMessage);
      break;
    case "warning":
      toast.warning(message);
      break;
    default:
      toast.info(message);
  }
};