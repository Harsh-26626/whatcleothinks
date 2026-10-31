/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FFFFFF',
        surface: '#F6F6F4',
        border: '#E5E5E1',
        primaryText: '#1A1A1A',
        muted: '#5F5F5A',
        marigold: '#F2B01E',
        accent: '#F2B01E',
        you: '#2F5BEA',
        them: '#F2B01E',
        group1: '#8E8E87',
        group2: '#C9C9C2',
        danger: '#B42318',
        successTick: '#1F7A4D',
      },
      borderRadius: {
        lg: '8px',
        xl: '12px',
      },
      fontFamily: {
        sans: ['Figtree', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1040px',
        reading: '680px',
      },
      spacing: {
        '18': '4.5rem', // 72px
      },
    },
  },
  plugins: [],
}
