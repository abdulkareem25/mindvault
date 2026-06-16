import { ToastContainer, Slide, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ── Design tokens (mirror tailwind.config.js) ──────────────────────────────
const T = {
  void:    "#111110",
  obsidian:"#1c1917",
  ink:     "#232220",
  dusk:    "#2d2b28",
  divide:  "#3a3835",
  fade:    "#524f4a",
  cream:   "#f0ede6",
  mist:    "#c4bfb8",
  smoke:   "#736e67",
  ember:   "#d4714e",
  ok:      "#3a9162",
  danger:  "#c94040",
  warn:    "#d4a84c",
  info:    "#4a8dd4",
};

// Shared base styles for every toast
const baseStyle = {
  fontFamily: "'DM Sans', system-ui, sans-serif",
  fontSize:   "13.5px",
  fontWeight: "500",
  lineHeight: "1.55",
  background: T.dusk,
  color:      T.cream,
  border:     `1px solid ${T.divide}`,
  borderRadius: "10px",
  padding:    "12px 14px",
  boxShadow:  "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.25)",
  maxWidth:   "360px",
  minHeight:  "unset",
};

const Toast = () => (
  <ToastContainer
    position="bottom-right"
    autoClose={3500}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    transition={Slide}
    style={{ bottom: "24px", right: "24px" }}
    toastStyle={baseStyle}
    bodyStyle={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      fontSize:   "13.5px",
      color:      T.cream,
      padding:    0,
      margin:     0,
      gap:        "10px",
      alignItems: "flex-start",
    }}
    progressStyle={{ background: T.ember, height: "2px" }}
  />
);

export default Toast;

// ── Per-type toast options ──────────────────────────────────────────────────
const opts = (accentColor, duration) => ({
  style: {
    ...baseStyle,
    borderLeft: `3px solid ${accentColor}`,
  },
  progressStyle: { background: accentColor, height: "2px" },
  autoClose: duration,
});

export const showToast = (type = "info", message) => {
  const msg = message || "Something went wrong";
  switch (type) {
    case "success":
      return toast.success(msg, opts(T.ok, 3000));
    case "error":
      return toast.error(msg, opts(T.danger, 4500));
    case "warning":
      return toast.warning(msg, opts(T.warn, 4000));
    default:
      return toast.info(msg, opts(T.info, 3500));
  }
};