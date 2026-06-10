/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Backgrounds ── */
        void:       '#111110',
        obsidian:   '#1c1917',
        ink:        '#232220',
        dusk:       '#2d2b28',
        divide:     '#3a3835',
        fade:       '#524f4a',
        /* ── Text ── */
        cream:      '#f0ede6',
        mist:       '#c4bfb8',
        smoke:      '#736e67',
        ash:        '#4e4b47',
        /* ── Brand ── */
        ember:      '#d4714e',
        glow:       '#e0845f',
        cinder:     '#3d2218',
        sienna:     '#c4835c',
        /* ── Status ── */
        'ok':       '#3a9162',
        'warn':     '#d4a84c',
        'danger':   '#c94040',
        'info':     '#4a8dd4',
        /* ── Category ── */
        'coding-bg':   '#1a2035', 'coding-fg':   '#7099e8',
        'deen-bg':     '#2a1e38', 'deen-fg':     '#b88cdb',
        'admin-bg':    '#2a2618', 'admin-fg':    '#d4a84c',
        'life-bg':     '#1a2e20', 'life-fg':     '#5ec98a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"DM Mono"', 'Consolas', 'monospace'],
      },
      fontSize: {
        '11': ['11px', { lineHeight: '1.5' }],
        '12': ['12px', { lineHeight: '1.5' }],
        '13': ['13px', { lineHeight: '1.55' }],
        '14': ['14px', { lineHeight: '1.6' }],
        '15': ['15px', { lineHeight: '1.65' }],
        '17': ['17px', { lineHeight: '1.65' }],
        '18': ['18px', { lineHeight: '1.5' }],
        '20': ['20px', { lineHeight: '1.4' }],
        '24': ['24px', { lineHeight: '1.3' }],
        '32': ['32px', { lineHeight: '1.2' }],
        '42': ['42px', { lineHeight: '1.15' }],
      },
      borderRadius: {
        'sm':    '6px',
        DEFAULT: '8px',
        'md':    '10px',
        'lg':    '12px',
        'xl':    '16px',
        '2xl':   '24px',
        'full':  '9999px',
      },
      boxShadow: {
        'card':        '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        'card-hover':  '0 4px 16px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.2)',
        'modal':       '0 24px 64px rgba(0,0,0,0.5), 0 4px 24px rgba(0,0,0,0.3)',
        'toast':       '0 4px 16px rgba(0,0,0,0.4)',
        'input-focus': '0 0 0 3px rgba(212,113,78,0.25)',
        'input-error': '0 0 0 3px rgba(201,64,64,0.25)',
        'none':        'none',
      },
      transitionDuration: { DEFAULT: '200ms' },
      keyframes: {
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'blink':   { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.25' } },
      },
      animation: {
        shimmer:   'shimmer 1.5s infinite linear',
        'fade-up': 'fade-up 220ms ease forwards',
        'fade-in': 'fade-in 200ms ease forwards',
        'blink':   'blink 1.4s ease-in-out infinite',
      },
      height: { screen: '100dvh' },
      minHeight: { screen: '100dvh' },
    },
  },
  plugins: [],
};
