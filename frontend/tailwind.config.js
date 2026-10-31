/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        page: '#FFFFFF',
        ink: '#1C1A33',
        muted: '#5A5873',
        line: '#E7E5F0',
        coral: {
          DEFAULT: '#CF3A26',
          hover: '#B32F1D',
        },
        butter: '#FFF3C9',
        sky: '#DCEBFF',
        lilac: '#E9E3FF',
        peach: '#FFE5D6',
        blush: '#FFE0E8',
        you: '#3B5BDB',
        them: '#F28C28',
        youBubble: '#D6E2FF',
        chatPanel: '#F1EDFF',
        volumeBars: '#CFC3FF',
        danger: '#B42318',
        success: '#1F7A4D',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '20px',
        '2xl': '28px',
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', '"Noto Sans Devanagari"', 'sans-serif'],
        sans: ['Figtree', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1100px',
        reading: '680px',
      },
    },
  },
  plugins: [],
}
