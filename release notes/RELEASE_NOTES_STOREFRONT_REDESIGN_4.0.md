# Release Notes — v4.0.0

**WooNext storefront redesign**

A full rebuild of the storefront against the prototype in
`wordpress/demo-project/WooNext-Storefront-Redesign`, ported with Tailwind
utility classes. Every page is replaced rather than restyled.

Design fidelity was checked mechanically: prototype `class` attributes were
diffed against the ported source in both directions. `WooNext.dc.html`,
`BuyBox.dc.html`, `Cart.dc.html` and `Catalog.dc.html` have **zero** missing
classes; `ProductPage.dc.html` and `Checkout.dc.html` differ only by the
deliberate divergences noted below. No invented type or spacing values.

---

## Store seed (WooCommerce)

Seeded `shop.widesprout.com` from the prototype's `store.js`:

- 61 `wn-*.webp` images registered as attachments, alt text named after the
  product that owns each one (featured usage wins over gallery usage).
- 7 top-level categories + 21 subcategories. Sub-slugs are parent-prefixed
  (`women-outerwear`, `kids-outerwear`) because "Outerwear" and "Sets" appear
  under two parents and term slugs are global.
- 39 products — 11 simple, 28 variable (**182 variations**), 2 downloadable.
  SKUs `WN-101`–`WN-139`. Per-size pricing, out-of-stock size/colour
  combinations, low-stock and sold-out states all match the prototype.
- 117 approved reviews, ratings spread 4.00 / 4.33 / 4.67 / 5.00.
- `total_sales` set from the prototype's popularity score so WooCommerce's
  native popularity sort matches the design.

Removed the 18 WooCommerce sample products, 6 sample categories and 5 unused
attribute terms.

---

## Phase 0 — Foundations

- `tailwind.config.js`: the prototype's full token set — 11-colour palette
  (midnight → sand), `font-display`/`font-sans`/`font-script`, `text-giant`,
  `text-mega`, portrait/tall/wide aspect ratios. `@tailwindcss/forms` added.
- Fonts via `next/font/google` (Anton, Archivo, Pinyon Script) as CSS
  variables — self-hosted, no external stylesheet.
- `ui/Icon.js` (all 54 prototype icons), `ui/Img.js` (`next/image` fill mode).

## Phase 1 — Shell

Sticky header with mega menu, debounced GraphQL search overlay (suggested /
trending / skeleton / no-match / results), mobile nav drawer, cart drawer wired
to the **live WooCommerce session cart**, footer with newsletter and the
viewport-wide wordmark, toast stack, focus trap, skip link.

`Header.js`, `Nav.js`, `Footer.js`, `CartIcon.js` deleted.

## Phase 2 — Home

All 11 sections: hero, services strip, category tiles, featured trio, "Fresh
off the rail", story block with a working AW26 lookbook dialog, brand strip,
sale banner with live countdown, store mosaic, auto-scrolling style ticker,
testimonial carousel, FAQ accordion.

Plus `ProductCard` and a working `QuickView` — reused by every later phase.

## Phase 3 — Catalog

`/shop`, all 28 category pages, and a new SSR `/search/[query]`. One `Catalog`
component drives all three: hero with breadcrumb, subcategory nav, filter
sidebar (category/type, size, colour, price band, in-stock) with exact counts,
5 sort modes, applied-filter chips, numbered pagination.

A subcategory loads its department's catalog with that type pre-applied, so
switching type keeps your other filters.

## Phase 4 — Product page

Gallery (thumbnail rail, pointer-tracked zoom, full-screen viewer), buy box
driven by the real 182 variations, size-guide dialog, Description/Details/
Reviews tabs with roving-tabindex keyboard nav and a real rating histogram,
related products, recently viewed. Buy-it-now adds to the cart then goes to
checkout.

Verified with a 25-assertion harness over live catalog data — per-size pricing,
out-of-stock combinations, size ordering, single-colour auto-select.

## Phase 5 — Cart

Cart page with batched quantity edits ("Update cart"), coupon form, order
summary with country and rate chooser; wishlist page.

Verified with a 19-assertion harness over a live cart.

**WooCommerce configured:** shipping zone (EU + GB + CH) with Standard 4,95 €,
Express 12,95 €, free Store pickup and Free shipping over 75 €; coupons
`WOONEXT10`, `RETRO25`, `FREESHIP`; 21% price-inclusive VAT (displayed prices
unchanged).

## Phase 6 — Checkout

Three-section checkout (contact & billing, shipping, payment) with an error
summary, coupon, order notes, terms, and the order review panel. New
confirmation page reading the real order.

Card runs through the existing Stripe Checkout flow; Direct bank transfer and
Cash on delivery go through the GraphQL `checkout` mutation. Verified by
placing real orders on both paths — identical totals (194,40 €).

Entire old checkout tree deleted (`CheckoutForm`, `Address`, `CountrySelection`,
`StatesSelection`, `PaymentModes`, `YourOrder`, `CheckoutCartItem`, `Error`,
`OrderSuccess`, `form-elements/`, both old validators, `utils/checkout.js`).
All four Stripe/REST API routes kept.

---

## Bug fixes

**In the existing codebase**

- `getFormattedCart` used `getFloatVal`, which drops cents on EUR formatting
  (`1.234,56 €` → `1.234`). Now uses `parsePriceNumber`.
- Cart line prices showed the **discounted** figure. WooCommerce returns a
  line's `subtotal` net and pre-discount but its `total` gross and
  post-discount; the table now shows list prices with the discount applied once
  in the summary.
- All cart totals needed grossing up — cart-level figures come back net, so
  every displayed total is `net + tax`.
- **`variation_id` was never sent** on order creation (a `@TODO`). Every
  variable product would have been ordered as its parent, losing the chosen
  size and colour. Affects the whole catalogue.
- Neither shipping nor coupons reached the REST order, so a card order would
  have been cheaper than the cart the customer agreed to.
- **Stripe charged the wrong amount** — it itemised products only, with no
  delivery or discount. Now charges the order total.
- `create-order` returned `data.number` where the webhook needed a REST id.
- A module-singleton Apollo client was shared between `getStaticProps` and
  component rendering, leaking build-time data into prerendered HTML and
  breaking hydration. Fixed with `defaultOptions.query.fetchPolicy: 'no-cache'`
  plus a mount guard in `useNavCategories`.
- Providers moved from `Layout` into `_app.js` so pages can use `useCart` /
  `useUI` in their own body.

**On the WordPress side**

- Free shipping didn't replace the paid standard rate — over 75 € WooCommerce
  offered both with the **paid one still selected**, charging shipping that
  wasn't owed. Fixed in `wp-content/mu-plugins/woonext-storefront-rules.php`,
  which also orders rates standard → express → pickup so standard stays the
  default.
- `wooCountries.billingCountries` returned an empty list, so the checkout
  country dropdown was dead. The Headless CMS plugin reads
  `WC()->countries->countries`, a lazily-populated property. Patched in the
  plugin repo (`/Users/imranhsayed/Projects/headless-cms`, uncommitted) and
  wrapped in the mu-plugin as a self-disabling fallback.
- Checkout state field: country changes left the previous country's state
  selected, the select had no placeholder, and state was never validated. Now
  shown and required exactly when the country has states.

---

## Deliberate divergences from the prototype

- **PayPal dropped** — no gateway installed. Checkout offers Card, Bank
  transfer, Cash on delivery.
- **Digital art tile dropped** — the prototype draws a gradient for Single and
  Album; the store has real cover art, shown with a "Digital" badge.
- **"Returning customer? Sign in" omitted** from checkout — auth is Phase 7 and
  a non-functional form would mislead. Guest checkout works fully.
- **Buy-it-now uses the real cart** rather than the prototype's isolated
  buy-now session.
- **Editorial copy lives in the frontend** (`src/constants/`) — WPGraphQL does
  not expose the term meta holding each category's kicker, title and banner.

---

## Known limitations

- Catalog filtering is client-side; each route fetches up to 100 products at
  build time. Fine into the low hundreds, then wants server-side
  `taxonomyFilter`/`minPrice` queries and cursor pagination.
- Card orders stay `pending` until the Stripe webhook fires — needs
  `stripe listen --forward-to localhost:3000/api/stripe-web-hook` in dev.
- Ticker counts undercount Denim and Knitwear: WooCommerce search indexes
  title/content/SKU, not attributes or subcategory names.
- `totalSales` is private over public GraphQL, so popularity rank comes from a
  server-ordered query.
- Wishlist and recently-viewed are browser-local until accounts land.

---

## Remaining work

### Phase 7 — Account

**Blocked on a decision:** real authentication (a WPGraphQL JWT plugin on
WordPress) or keep deferring.

- Login, register, forgot password, reset password.
- Seven dashboard tabs: dashboard, orders, order detail, track order,
  downloads, addresses, payment methods, account details.
- Move wishlist from `localStorage` to user meta.
- Restore the "Returning customer? Sign in" block on checkout and prefill
  saved addresses.

### Phase 8 — Info pages

- `about`, `shipping`, `returns`, `privacy`, `terms`, `contact`, `faq`,
  `size-guide`, `track-order`, and a designed `404`.
- Content exists in the prototype's `Info.dc.html`. Decide whether it lives in
  WordPress pages or frontend constants.
- These are the only links in the footer and mobile nav that still 404.

### Also outstanding

- `/categories` is the last old-design page.
- `src/components/category/category-block/*` and `src/components/icons/*` are
  the remaining legacy components.
- Replace the `via.placeholder.com` fallbacks in `src/constants/urls.js`.
- Push the `headless-cms` country fix, then drop the mu-plugin fallback.
