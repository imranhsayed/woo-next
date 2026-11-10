# Release Notes — v3.0.0

**Next.js 11 → 16 upgrade**

This release moves the project five Next.js majors (11.1.1 → 16.4.5) and two React
majors (17 → 19), replaces an abandoned payment dependency, and fixes a number of
latent bugs that the newer runtimes turned fatal.

It is a **breaking release**: it requires a newer Node.js and an additional
WordPress plugin. See [Upgrading](#upgrading) before deploying.

---

## Requirements

| | Before | Now |
|---|---|---|
| Node.js | — | **≥ 20.9.0** (required by Next.js 16) |
| Package manager | yarn / npm (both lockfiles present) | **npm** |

WordPress plugins — all three are required:

- `wp-graphql`
- `wp-graphql-woocommerce` — **install the built release zip**, not the GitHub
  source archive. The source archive omits `vendor/`, which causes a fatal
  `Firebase\JWT\JWT not found` on every GraphQL request.
- `headless-cms` — provides the `wooCountries` and `wooStates` fields the
  checkout page queries. Bundled at `wordpress/plugins/headless-cms.zip`.

---

## Dependencies

### Upgraded

| Package | Before | After |
|---|---|---|
| next | ^11.1.1 | **^16.4.5** |
| react / react-dom | 17.0.1 | **^19.3.1** |
| tailwindcss | ^1.9.6 | ^3.4.19 |
| @apollo/client | ^3.3.16 | ^3.14.1 |
| graphql | ^15.4.0 | ^16.15.0 |
| stripe | ^8.148.0 | ^23.1.0 |
| sass | ^1.29.0 | ^1.108.1 |
| axios | ^0.21.1 | ^1.21.0 |
| uuid | ^8.3.1 | ^14.0.3 |
| @svgr/cli | ^5.5.0 | ^8.1.0 (moved to devDependencies) |

Also bumped: `@woocommerce/woocommerce-rest-api`, `classnames`, `lodash`,
`prop-types`, `validator`. Added `postcss` and `autoprefixer` as explicit
devDependencies.

### Removed

| Package | Why |
|---|---|
| `next-stripe` | Abandoned (last published May 2022) and hard-pins `stripe@8.132.0`, so it cannot coexist with a modern Stripe SDK. Replaced with a first-party API route. |
| `@stripe/stripe-js` | Only used for the deprecated `redirectToCheckout`. Checkout now redirects to the Stripe-hosted `session.url`, so no publishable key is needed. |
| `node-fetch` | Node 18+ has a global `fetch`. |
| `micro` | Its `buffer()` helper is replaced by a small raw-body reader. |
| `precss`, `postcss-import`, `postcss-flexbugs-fixes`, `postcss-preset-env` | PostCSS 7-era packages superseded by Tailwind 3 + autoprefixer. |
| `install` | A no-op package that was never imported. |

`yarn.lock` was deleted and `package-lock.json` regenerated — every dependency
crossed a major, so neither old lockfile was salvageable.

---

## Breaking changes handled

### Next.js 12
- `process.browser` was removed → replaced with `typeof window !== 'undefined'` at 7 call sites.
- `webpackDevMiddleware` was removed from `next.config.js` (Turbopack handles file watching).

### Next.js 13
- `<Link>` no longer accepts an `<a>` child → unwrapped across 8 components; `className` moved onto `<Link>`.
- Two `<Link><button>` pairs became styled `<Link>`s, since `<Link>` now renders the anchor itself and nesting a button inside it is invalid markup.
- `next/image` dropped `layout` / `objectFit` → `src/image/index.js` rewritten around the `fill` prop plus CSS.

### Next.js 15 / 16
- React 19 is now the minimum.
- Turbopack is the default bundler.
- `images.domains` → `images.remotePatterns`.
- Sass no longer resolves the legacy `~` prefix → `~tailwindcss/...` imports replaced with `@tailwind` directives, and `nprogress.css` is imported from `_app.js`.

### React 19
- `defaultProps` on function components was removed → converted to default parameters in 6 components.
- An `async` `useEffect` callback now throws `destroy is not a function`, because React treats the returned Promise as the cleanup function. Fixed in `CheckoutForm.js`.

### Tailwind 1 → 3
- `purge` → `content`, the `future` flags dropped, and the `plugins` array cleaned up (it had incorrectly listed PostCSS plugins).
- `postcss.config.js` reduced to `tailwindcss` + `autoprefixer`.

---

## Stripe checkout rewrite

`next-stripe` had to go, and the surrounding code was built against a
pre-2020 Stripe API, so the flow was rebuilt:

- **New** `pages/api/create-checkout-session.js` creates the session server-side.
- `line_items` migrated from the legacy `{name, amount, currency, images}` shape
  to the current `{price_data: {currency, unit_amount, product_data}}` shape.
- The client now redirects to the Stripe-hosted `session.url` instead of calling
  the deprecated `stripe.redirectToCheckout()`.
- `payment_method_types` was dropped — it is no longer a documented create
  parameter in Stripe v23. Payment methods now come from the Stripe Dashboard.
  To restrict them, use `allowed_payment_method_types`.
- The webhook reads its raw body via a local helper instead of `micro`, and the
  pinned `apiVersion: '2020-08-27'` was removed so the account default applies.

---

## Bug fixes

Found while upgrading; all pre-existing.

- **`&nbsp;` rendered literally in prices.** WooCommerce returns prices as HTML
  (`15,00&nbsp;€`) and React escapes text nodes. Added a DOM-free
  `decodeHtmlEntities()` (so it behaves the same during SSR), applied in
  `getFormattedCart()` and the `Price` component.
- **`(NaN%) OFF` on discounted products.** `Price` used `substring(1)` to strip a
  leading `$`, which breaks for currencies whose symbol trails and whose decimal
  mark is a comma. Replaced with `parsePriceNumber()`, handling both separator
  conventions and price ranges.
- **A trailing slash in `NEXT_PUBLIC_WORDPRESS_URL` broke every query.** It
  produced `//graphql`, which WordPress serves as the homepage HTML. The base URL
  is now normalised once in `src/constants/urls.js`.
- **`/api/create-order` hung on an empty body** — it returned a value without ever
  calling `res`. Now returns HTTP 400.
- **`defaultImgUrl` was ignored** in the non-`fill` image branch, so product cards
  silently fell back to a 400×225 placeholder while declaring 308×308.
- **Empty billing country dropdown.** `headless-cms` resolves `billingCountries`
  from the raw `WC()->countries->countries` property, which modern WooCommerce
  leaves unpopulated. Added a fallback to `shippingCountries`; the real value wins
  automatically if the plugin is ever fixed.
- **Apollo deprecation noise.** `useQuery`'s `onCompleted` is deprecated in
  3.14 and was firing during static generation. Moved to `useEffect` in three
  components, which also fixes a stale-closure bug where the callback read the
  *previous* render's `data`.

---

## Decisions and why

**Change one risky thing at a time.** Five Next majors plus React 17 → 19 is
already a large surface. Every extra major stacked on top makes failure
attribution impossible — if the cart breaks, there should be one suspect, not four.
That principle drove most of the choices below.

**Apollo Client 3.14, not 4.** 3.14 already declares React 19 support in its peer
ranges, so it satisfies the upgrade without a rewrite. v4 drops the `ApolloLink`
composition style that `ApolloClient.js` uses for the `woocommerce-session`
middleware/afterware pair — which *is* the cart-session mechanism — and changes
hook result shapes. Deferring it keeps cart persistence out of the blast radius.
`graphql` went to 16 rather than 17 because that is what Apollo 3.14 accepts.

**Tailwind 3, not 4.** v3 keeps the JS config format (only `purge` → `content`)
and requires no utility renames. v4 would mean CSS-first `@theme` config and
auditing every `className` in the project — a separate migration.

**Pages Router retained.** Migrating to the App Router is a rewrite, not an
upgrade, and is out of scope here.

**Stripe rewrite was forced, not chosen.** `next-stripe` pins `stripe@8`, so it
physically blocks the SDK upgrade. Since the call site had to change anyway, the
legacy `line_items` shape was modernised at the same time.

**`propTypes` left in place.** React 19 ignores them, so the six components that
declare them are carrying dead code. Removing them is cosmetic and was left out to
keep the diff reviewable.

**Fixes applied at the data layer where possible.** Entity decoding and URL
normalisation live in `getFormattedCart()` and `src/constants/urls.js` rather than
at each render site, so the ten places that display a price and the four that build
a WordPress URL are all covered by two changes.

---

## Verification

- `next build` passes against a live WooCommerce store — 34 pages prerendered
  (7 categories, 18 products, plus static routes).
- `next dev` and `next start` both serve all routes with HTTP 200 and no
  errors or warnings.
- `next/image` emits optimised `/_next/image/` srcsets at `q=75`, matching
  Next 16's new `qualities: [75]` default.
- Tailwind output verified: custom utilities present, unused ones purged.
- API routes return 405 / 400 / 500 correctly; the Stripe `line_items` shape was
  checked field-by-field against `stripe@23`'s own type definitions.

**Not covered:** a complete add-to-cart → checkout → Stripe redirect run against
live credentials, and the `GroupProduct` / `VariableProduct` / `ExternalProduct`
render branches.

---

## Upgrading

1. Install Node.js 20.9+.
2. `npm install` (delete `node_modules` first if upgrading in place).
3. Copy `.env-example` to `.env.local` and fill it in.
   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is no longer used and has been removed.
   **Do not add a trailing slash to `NEXT_PUBLIC_WORDPRESS_URL`** (now tolerated,
   but still worth avoiding).
4. On WordPress, install all three plugins listed under
   [Requirements](#requirements), using the **release** zip for
   `wp-graphql-woocommerce`.
5. In **WooCommerce → Settings → Payments**, enable the gateways you intend to
   offer. The payment options in `PaymentModes.js` are hardcoded, and any gateway
   that is not enabled and available will fail checkout with
   *"Invalid payment method."*
6. Point your Stripe webhook at `/api/stripe-web-hook`.

---

## Known issues and follow-ups

- **Prices are client-controlled at checkout.** `src/utils/checkout.js` sends
  `unit_amount` from the browser, so a tampered request could set its own price.
  This predates the upgrade — the old `next-stripe` flow did the same — but it
  should be fixed by building line items server-side from the Woo session.
- **`getFloatVal()` drops cents for comma-decimal locales.** `"2,50 €"` parses as
  `2`. It feeds cart totals and the Stripe amount, so it can undercharge.
  `parsePriceNumber()` in `src/functions.js` already handles this correctly and
  should replace it, but the change touches money calculations and needs a real
  checkout test.
- **`PaymentModes.js` is hardcoded** and does not reflect the store's enabled
  gateways. It should render from the API.
- **`propTypes` are dead code** under React 19 in six components.
- **Apollo Client 4** remains a deliberate follow-up.
