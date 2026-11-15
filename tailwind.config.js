/**
 * WooNext design tokens.
 *
 * Ported from the storefront prototype in
 * `wordpress/demo-project/WooNext-Storefront-Redesign/tailwind.config.js`.
 * These are the only custom tokens the storefront uses — everything else is
 * stock Tailwind (spacing, radius, durations).
 *
 * Fonts are loaded with `next/font` in `pages/_app.js`, which exposes them as
 * the CSS variables referenced below.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    './src/**/*.js',
    './pages/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#071a2c', // page background, deepest surface
        navy:     '#0b2a45', // footer, secondary panels
        petrol:   '#0e3a56', // cards, drawers, form fields
        teal:     '#0f4f68', // section surfaces, image fallbacks
        lagoon:   '#176b85', // hover surface, muted logo strip ink
        rust:     '#c8441a', // primary buttons, header icon buttons, logo
        ember:    '#ee5f22', // hover/active accent, badges, wishlist active
        flame:    '#ff7a3d', // prices, links, focus rings
        peach:    '#fbd5b8', // header bar, body copy on dark
        cream:    '#fff0e2', // headings on dark, light buttons
        sand:     '#f2b98f', // reserve warm neutral
      },
      fontFamily: {
        display: ['var(--font-display)', 'Anton', 'Impact', 'sans-serif'],
        sans:    ['var(--font-sans)', 'Archivo', 'system-ui', 'sans-serif'],
        script:  ['var(--font-script)', 'Pinyon Script', 'cursive'],
      },
      fontSize: {
        giant: ['9.5rem', { lineHeight: '0.85' }], // desktop hero headline
        mega:  ['25vw',   { lineHeight: '0.8' }],  // footer WOONEXT wordmark
      },
      aspectRatio: {
        portrait: '3 / 4',  // product cards, gallery
        tall:     '2 / 3',  // editorial tiles
        wide:     '16 / 9', // video / lookbook tiles
      },
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
  plugins: [require('@tailwindcss/forms')],
}
