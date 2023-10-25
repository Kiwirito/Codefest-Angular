/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      screens: {
        'sms': '340px',


      },
    },
    negM: {
      '1': '0.25rem', // Puedes ajustar este valor según tus necesidades
      '2': '0.5rem', // Aquí puedes definir otros valores de espacio negativo
    },
  },
  plugins: [require('flowbite/plugin')],
}

