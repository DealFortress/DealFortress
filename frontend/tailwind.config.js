/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
        container: {
            padding: '1rem',
          },
    },
    colors: {
        'bodyblue': '#18222f',
        'darkblue': '#27374D',
        'blue': '#526D82',
        'greyblue': '#9DB2BF',
        'lightblue': '#DDE6ED',
        'black': 'black',
        'transparent': 'transparent',
        'white': 'white',
        'red': '#9F192F',
        'green': '#7dac99',
        'lighttexthover': 'lightblue'
    },
    plugins: [require("daisyui")],
    daisyui: {
      themes: true,
      styled: true,
      themes: [{
        "dark": {
          "primary": "blue",
          "primary-content": "blue",
          "secondary": "blue",
          "secondary-content": "blue",
          "accent": "blue",
          "accent-content": "blue",
          "neutral": "blue",
          "neutral-focus": "blue",
          "neutral-content": "blue",
          "base-100": "blue",
          "base-200": "blue",
          "base-300": "blue",
          "base-content": "blue",
        },
        "[data-theme=dark]": {
          "color-scheme": "dark",
          "primary": "blue",
          "primary-content": "blue",
          "secondary": "blue",
          "secondary-content": "blue",
          "accent": "blue",
          "accent-content": "blue",
          "neutral": "blue",
          "neutral-focus": "blue",
          "neutral-content": "blue",
          "base-100": "blue",
          "base-200": "blue",
          "base-300": "blue",
          "base-content": "blue",
        },
        "light": {
        }
      }],
      base: true,
      utils: true,
      logs: true,
      rtl: false,
    },
    }
}
