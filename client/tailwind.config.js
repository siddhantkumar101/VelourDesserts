/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          DEFAULT: '#C9897B',
          light: '#E8C5BC',
          dark: '#9E5E52',
        },
        cream: {
          DEFAULT: '#FAF6F1',
          dark: '#F0E8DF',
        },
        chocolate: '#2C1810',
        mocha: '#5C3D2E',
        gold: '#B8965A',
        success: '#4A7C59',
        error: '#C0392B',
        warning: '#D4A017',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 2px 16px rgba(44, 24, 16, 0.08)',
        modal: '0 8px 48px rgba(44, 24, 16, 0.18)',
        hover: '0 6px 24px rgba(44, 24, 16, 0.14)',
      },
    },
  },
  plugins: [],
}
