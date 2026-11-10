/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.js',
    './pages/**/*.js',
  ],
  theme: {
    extend: {
      height: {
        'almost-screen': 'calc(-16rem + 100vh)',
        '308px': '19.25rem',
      },
      width: {
        '308px': '19.25rem',
        '600px': '37.5rem',
      },
    },
  },
  plugins: [],
}
