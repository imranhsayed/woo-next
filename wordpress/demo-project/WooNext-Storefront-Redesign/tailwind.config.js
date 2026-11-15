/**
 * WooNext design tokens — Tailwind CSS v3
 * Drop into your theme build (tailwind.config.js). These are the ONLY custom tokens the
 * storefront uses; everything else is stock Tailwind v3 (spacing, radius, durations, etc.).
 *
 * Fonts (load in <head>):
 * <link href="https://fonts.googleapis.com/css2?family=Anton&family=Archivo:wght@300;400;500;600;700;800&family=Pinyon+Script&display=swap" rel="stylesheet">
 */
module.exports = {
  content: ['./**/*.{html,js,jsx,php}'],
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
        display: ['Anton', 'Impact', 'sans-serif'],      // condensed uppercase headlines, prices
        sans:    ['Archivo', 'system-ui', 'sans-serif'], // body, labels, UI
        script:  ['"Pinyon Script"', 'cursive'],         // editorial accents ("Made from…", "The … of")
      },
      fontSize: {
        giant: ['9.5rem', { lineHeight: '0.85' }], // desktop hero headline
        mega:  ['25vw',   { lineHeight: '0.8' }],  // footer WOONEXT wordmark (fills viewport width)
      },
      aspectRatio: {
        portrait: '3 / 4',  // product cards, gallery
        tall:     '2 / 3',  // editorial tiles
        wide:     '16 / 9', // video / lookbook tiles
      },
    },
  },
  plugins: [require('@tailwindcss/forms')], // optional: matches the form reset used in the prototype
};

/*
 * Usage conventions (stock utilities)
 * Radius:   rounded-md (cards, buttons, panels) · rounded-full (icon buttons, chips) · rounded-lg (modals)
 * Type:     labels  text-xs font-bold uppercase tracking-widest
 *           headings font-display uppercase leading-none (text-5xl → text-giant)
 * Motion:   controls duration-200 · drawers/accordions duration-300 · image zoom/reveals duration-500
 *           always pair with motion-reduce:transition-none / motion-reduce:transform-none
 * Focus:    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame
 * Touch:    min-h-11 / h-11 w-11 minimum for interactive targets
 */
