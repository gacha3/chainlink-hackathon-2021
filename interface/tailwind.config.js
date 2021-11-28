module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
        montserrat: ['Montserrat'],
      },
      colors: {
        'cryptopunk-red': '#95554F',
        'cryptopunk-blue': '#adc9d6',
        'cryptopunk-purple': '#b8a7ce',
        secondary: '#777777',
        accent: ({ opacityVariable, opacityValue }) => {
          if (opacityValue !== undefined) {
            return `rgba(var(--accent-color), ${opacityValue})`
          }
          if (opacityVariable !== undefined) {
            return `rgba(var(--accent-color), var(${opacityVariable}, 1))`
          }
          return `rgb(var(--accent-color))`
        },
      },
      typography: (theme) => ({
        dark: {
          css: {
            color: 'white',
            a: {
              color: 'white',
            },
            h1: {
              color: 'white',
            },
            h2: {
              color: 'white',
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      typography: ['dark'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
