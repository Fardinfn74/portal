/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Cascadia Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        ghost: '0 18px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)',
        glow: '0 0 24px rgba(77, 255, 184, 0.28)',
      },
    },
  },
  plugins: [],
};
