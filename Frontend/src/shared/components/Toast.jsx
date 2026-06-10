import { toast as hotToast } from 'react-hot-toast';

const toastOptions = {
  style: {
    fontFamily: "'DM Sans', sans-serif",
    background: '#2d2b28', // dusk
    color: '#f0ede6',      // cream
    border: '1px solid #3a3835', // divide
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
  },
};

const toast = {
  success: (message, options) => hotToast.success(message, { ...toastOptions, ...options }),
  error:   (message, options) => hotToast.error(message,   { ...toastOptions, ...options }),
  info:    (message, options) => hotToast(message,         { ...toastOptions, ...options }),
  loading: (message, options) => hotToast.loading(message, { ...toastOptions, ...options }),
  dismiss: (toastId) => hotToast.dismiss(toastId),
};

export default toast;
export { hotToast };
export const showToast = (type, message, options) => {
  if (type === 'success') return toast.success(message, options);
  if (type === 'error')   return toast.error(message, options);
  if (type === 'info')    return toast.info(message, options);
  return toast.loading(message, options);
};
