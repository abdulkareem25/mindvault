import { toast as hotToast } from 'react-hot-toast';

const toastOptions = {
  style: {
    fontFamily: "'DM Sans', sans-serif",
    background: '#faf9f5', // Ivory
    color: '#1a1a1a',
    border: '1px solid #e8e6dc', // Border Warm
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
};

const toast = {
  success: (message, options) => hotToast.success(message, { ...toastOptions, ...options }),
  error: (message, options) => hotToast.error(message, { ...toastOptions, ...options }),
  loading: (message, options) => hotToast.loading(message, { ...toastOptions, ...options }),
  dismiss: (toastId) => hotToast.dismiss(toastId),
};

export default toast;
export { hotToast };
