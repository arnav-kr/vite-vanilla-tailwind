const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['**.{html,js,css}'],
  dardMode: "class",
  theme: {
    ...defaultTheme,
    fontFamily: {
      sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      serif: ['Merriweather', 'serif'],
    },
    extend: {
      spacing: {
        '8xl': '96rem',
        '9xl': '128rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  variants: {
    cursor: ['disabled', 'focus'],
    pointerEvents: ['disabled', 'focus'],
    backgroundColor: ['disabled', 'focus'],
    color: ['disabled', 'focus'],
    text: ['disabled', 'focus'],
    'box-shadow': ['disabled', 'focus'],
    opacity: ['disabled', 'focus'],
    border: ['disabled', 'focus'],
    'border-color': ['disabled', 'focus'],
  },
  Plugins: [
  ],
}