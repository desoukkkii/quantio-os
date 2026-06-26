/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', '"SF Pro Text"', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      animation: {
        'boot-pulse': 'bootPulse 1.6s cubic-bezier(0.4,0,0.2,1) infinite',
        'window-in': 'windowIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
        'window-out': 'windowOut 0.12s cubic-bezier(0.4,0,0.2,1) forwards',
        'spotlight-in': 'spotlightIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
        'dropdown-in': 'dropdownIn 0.12s cubic-bezier(0.4,0,0.2,1)',
        'ctx-in': 'ctxIn 0.08s cubic-bezier(0.4,0,0.2,1)',
        'notif-slide-in': 'notifSlideIn 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        'dock-bounce': 'dockBounce 0.35s cubic-bezier(0.4,0,0.2,1)',
      },
      scale: {
        '94': '0.94',
        '98': '0.98',
        '104': '1.04',
        '105': '1.05',
        '112': '1.12',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
      },
      colors: {
        'os-bg': '#0b0d12',
        'os-surface': '#14161c',
        'os-elevated': '#1c1e26',
        'os-raised': '#24262e',
        'os-text': '#f5f6f8',
        'os-text-secondary': '#a8aab3',
        'os-text-tertiary': '#6b6d78',
      },
    },
  },
  plugins: [],
}
