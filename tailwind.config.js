/** @type {import('tailwindcss').Config} */

// Reads a CSS variable holding a "R G B" triplet so the color can shift with data-theme
// while still supporting Tailwind's opacity modifiers (e.g. bg-primary/10).
function themedColor(variable) {
  return ({ opacityValue }) =>
    opacityValue === undefined ? `rgb(var(${variable}))` : `rgb(var(${variable}) / ${opacityValue})`
}

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: themedColor('--color-primary'),
        primaryDark: themedColor('--color-primary-dark'),
        sage: {
          50: themedColor('--color-sage-50'),
          100: themedColor('--color-sage-100'),
          200: themedColor('--color-sage-200'),
          500: themedColor('--color-sage-500'),
          600: themedColor('--color-sage-600'),
          700: themedColor('--color-sage-700'),
        },
        accent: '#EB8F30',
        success: '#44A87C',
        info: '#6B7FBB',
        danger: '#CC6060',
        purple: '#9B7EC8',
        teal: '#47A8BD',
        babyBoy: { DEFAULT: '#4C7FAE', light: '#7FA8D9' },
        babyGirl: { DEFAULT: '#B85C87', light: '#E1A0C1' },
        babySurprise: { DEFAULT: '#B9932A', light: '#E8C468' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        cute: ['"Caveat"', 'cursive'],
      },
    },
  },
  plugins: [],
}

