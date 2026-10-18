/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0F1A',
        card: '#121826',
        'card-2': '#161D2E',
        line: '#233047',
        ink: '#E6EAF2',
        muted: '#94A3B8',
        // 支持透明度修饰符,如 bg-accent/15
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(.4,0,.2,1)',
      },
    },
  },
  plugins: [],
};
