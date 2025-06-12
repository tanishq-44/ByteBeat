/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulsate': 'pulsate 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'border-glow': 'pulsate 2s ease-in-out infinite, gradient-shift 3s linear infinite',
      },
      keyframes: {
        pulsate: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.6 },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
      },
      backgroundSize: {
        '200%': '200% 100%',
      },
    },
  },
  plugins: [],
}; 