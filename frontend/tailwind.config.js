/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,html}",
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
        'lighttexthover': 'lightblue',
        'base-0': '#232A33',
    },
    plugins: [require("daisyui")],
    daisyui: {
      themes: true,
      styled: true,
      themes: [{
        'dark': {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          '--p': '0, 100%, 100% !important',
          'primary': "pink",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          '--p': '0, 100%, 100% !important',
          'primary': "pink",
        }
      }],
      base: true,
      utils: true,
      logs: true,
      rtl: false,
    },
    }
}
