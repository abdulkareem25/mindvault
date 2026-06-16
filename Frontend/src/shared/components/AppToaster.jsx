import { Toaster } from 'react-hot-toast';

// ── Design tokens ──────────────────────────────────────────────────────────
const base = {
  fontFamily: "'DM Sans', system-ui, sans-serif",
  fontSize:   '13.5px',
  fontWeight: '500',
  lineHeight: '1.5',
  background: '#2d2b28',   // dusk
  color:      '#f0ede6',   // cream
  border:     '1px solid #3a3835', // divide
  borderRadius: '10px',
  padding:    '11px 15px',
  boxShadow:  '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
  maxWidth:   '360px',
};

const accent = (color) => ({ ...base, borderLeft: `3px solid ${color}` });

const toastOptions = {
  duration: 3500,
  style: base,
  success: {
    duration: 3000,
    iconTheme: { primary: '#3a9162', secondary: '#1c1917' },
    style: accent('#3a9162'),
  },
  error: {
    duration: 4500,
    iconTheme: { primary: '#c94040', secondary: '#1c1917' },
    style: accent('#c94040'),
  },
  loading: {
    iconTheme: { primary: '#d4714e', secondary: '#1c1917' },
    style: accent('#d4714e'),
  },
};

const AppToaster = () => (
  <Toaster
    position="bottom-right"
    gutter={10}
    containerStyle={{ bottom: 24, right: 24 }}
    toastOptions={toastOptions}
  />
);

export default AppToaster;
