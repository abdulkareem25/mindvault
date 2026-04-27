/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      // Primary
      'claude-black': '#141413',        // Anthropic Near Black
      'claude-terracotta': '#c96442',  // Terracotta Brand
      'claude-coral': '#d97757',       // Coral Accent

      // Semantic
      'claude-error': '#b53333',       // Error Crimson
      'claude-focus': '#3898ec',       // Focus Blue

      // Surface & Background
      'claude-parchment': '#f5f4ed',   // Primary page background
      'claude-ivory': '#faf9f5',       // Lightest surface
      'claude-sand': '#e8e6dc',        // Button backgrounds
      'claude-dark-surface': '#30302e', // Dark containers
      'claude-deep-dark': '#141413',   // Dark background

      // Neutrals & Text
      'claude-charcoal': '#4d4c48',    // Button text on light
      'claude-olive': '#5e5d59',       // Secondary text
      'claude-stone': '#87867f',       // Tertiary text
      'claude-dark-warm': '#3d3d3a',   // Dark text links
      'claude-warm-silver': '#b0aea5', // Text on dark

      // Borders
      'claude-border-cream': '#f0eee6', // Light border
      'claude-border-warm': '#e8e6dc',  // Prominent border
      'claude-border-dark': '#30302e',  // Dark border
      'claude-ring-warm': '#d1cfc5',    // Ring color
      'claude-ring-subtle': '#dedc01',  // Subtle ring
      'claude-ring-deep': '#c2c0b6',    // Deep ring

      // Transparent variants
      'transparent': 'transparent',
      'white': '#ffffff',
      'black': '#000000',

      // Standard Tailwind colors for gradients and legacy support
      'gray': {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      'green': {
        100: '#dcfce7',
        600: '#16a34a',
        700: '#15803d',
      },
      'red': {
        100: '#fee2e2',
        400: '#f87171',
        600: '#dc2626',
        700: '#b91c1c',
      },
    },
    extend: {

      // Typography
      fontFamily: {
        'serif': ['Georgia', 'serif'],       // Fallback for Anthropic Serif
        'sans': ['Arial', 'system-ui', 'sans-serif'], // Fallback for Anthropic Sans
        'mono': ['Courier New', 'monospace'], // Fallback for Anthropic Mono
      },

      // Font Sizes with Line Heights
      fontSize: {
        // Display / Hero
        'display': ['64px', { lineHeight: '1.10', letterSpacing: 'normal' }],
        // Section Heading
        'section-heading': ['52px', { lineHeight: '1.20', letterSpacing: 'normal' }],
        // Sub-heading Large
        'sub-lg': ['36px', { lineHeight: '1.30', letterSpacing: 'normal' }],
        // Sub-heading
        'sub': ['32px', { lineHeight: '1.10', letterSpacing: 'normal' }],
        // Sub-heading Small
        'sub-sm': ['25.6px', { lineHeight: '1.20', letterSpacing: 'normal' }],
        // Feature Title
        'feature': ['20.8px', { lineHeight: '1.20', letterSpacing: 'normal' }],
        // Body Serif
        'body-serif': ['17px', { lineHeight: '1.60', letterSpacing: 'normal' }],
        // Body Large
        'body-lg': ['20px', { lineHeight: '1.60', letterSpacing: 'normal' }],
        // Body / Nav
        'body-nav': ['17px', { lineHeight: '1.00', letterSpacing: 'normal' }],
        // Body Standard
        'body': ['16px', { lineHeight: '1.25', letterSpacing: 'normal' }],
        // Body Small
        'body-sm': ['15px', { lineHeight: '1.00', letterSpacing: 'normal' }],
        // Caption
        'caption': ['14px', { lineHeight: '1.43', letterSpacing: 'normal' }],
        // Label
        'label': ['12px', { lineHeight: '1.25', letterSpacing: '0.12px' }],
        // Overline
        'overline': ['10px', { lineHeight: '1.60', letterSpacing: '0.5px' }],
        // Micro
        'micro': ['9.6px', { lineHeight: '1.60', letterSpacing: '0.096px' }],
        // Code
        'code': ['15px', { lineHeight: '1.60', letterSpacing: '-0.32px' }],
      },

      // Font Weights
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },

      // Border Radius Scale
      borderRadius: {
        'sharp': '4px',
        'xs': '6px',
        'sm': '7.5px',
        'base': '8px',
        'md': '8.5px',
        'lg': '12px',
        'xl': '16px',
        'feature': '24px',
        'hero': '32px',
      },

      // Spacing System (8px base unit)
      spacing: {
        '0': '0',
        '1': '3px',
        '2': '4px',
        '3': '6px',
        '4': '8px',
        '5': '10px',
        '6': '12px',
        '8': '16px',
        '10': '20px',
        '12': '24px',
        '15': '30px',
        '16': '32px',
        '20': '40px',
        '24': '48px',
        '30': '60px',
        '40': '80px',
        '48': '96px',
        '60': '120px',
      },

      // Box Shadow / Depth System
      boxShadow: {
        // Flat (Level 0)
        'flat': 'none',
        // Contained (Level 1)
        'contained-light': '0px 0px 0px 1px #f0eee6',
        'contained-dark': '0px 0px 0px 1px #30302e',
        // Ring (Level 2)
        'ring-light': '0px 0px 0px 1px #d1cfc5',
        'ring-subtle': '0px 0px 0px 1px #dedc01',
        'ring-dark': '0px 0px 0px 1px #c2c0b6',
        // Whisper (Level 3)
        'whisper': 'rgba(0, 0, 0, 0.05) 0px 4px 24px',
        // Inset (Level 4)
        'inset-warm': 'inset 0px 0px 0px 1px rgba(0, 0, 0, 0.15)',
      },

      // Line Height
      lineHeight: {
        'tight': '1.10',
        'snug': '1.20',
        'normal': '1.30',
        'relaxed': '1.60',
      },

      // Letter Spacing
      letterSpacing: {
        'tight': '-0.32px',
        'normal': '0px',
        'wide': '0.12px',
        'wider': '0.5px',
        'widest': '1px',
      },

      // Max Width
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
}
