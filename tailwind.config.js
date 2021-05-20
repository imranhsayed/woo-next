module.exports = {
  // @see https://tailwindcss.com/docs/upcoming-changes
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [
    './src/components/**/*.js',
    './pages/**/*.js'],
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
  variants: {},
  plugins: [
    require( 'tailwindcss' ),
    require( 'precss' ),
    require( 'autoprefixer' )
  ]
}
