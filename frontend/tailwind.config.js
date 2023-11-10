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
    plugins: [require('daisyui')],
    }
}
