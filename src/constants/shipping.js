/**
 * Delivery presentation.
 *
 * WooCommerce owns the rates and what they cost. What lives here is how the
 * design describes them: the destinations offered in the estimate, and the
 * delivery promise beside each rate — WooCommerce has no field for an ETA.
 */

/** Destinations the storefront offers in the cart's shipping estimate. */
export const SHIPPING_COUNTRIES = [
	{ code: 'DE', name: 'Germany' },
	{ code: 'FR', name: 'France' },
	{ code: 'NL', name: 'Netherlands' },
	{ code: 'ES', name: 'Spain' },
	{ code: 'IT', name: 'Italy' },
	{ code: 'GB', name: 'United Kingdom' },
	{ code: 'CH', name: 'Switzerland' },
];

/** Countries where customs adds to the delivery estimate. */
const CUSTOMS_COUNTRIES = [ 'GB', 'CH' ];

/** Delivery promise per WooCommerce shipping method. */
const RATE_META = {
	free_shipping: { label: 'Standard delivery', eta: '3–5 working days' },
	flat_rate: { label: '', eta: '3–5 working days' },
	local_pickup: { label: 'Store pickup', eta: 'Ready in 24 hours' },
};

/** Express is a flat rate too, so it is matched on its instance. */
const EXPRESS_ETA = '1–2 working days';

/**
 * Label and delivery estimate for one rate.
 *
 * Falls back to the title set in WooCommerce, so a rate added later still
 * reads sensibly without a code change.
 *
 * @param {Object} rate    Shipping rate with `id` and `label`.
 * @param {string} country Destination country code.
 *
 * @return {{label: string, eta: string}} Display label and estimate.
 */
export const shippingRateMeta = ( rate, country = '' ) => {

	const method = ( rate.id ?? '' ).split( ':' )[ 0 ];
	const meta = RATE_META[ method ] ?? { label: '', eta: '' };

	const isExpress = /express/i.test( rate.label ?? '' );
	const eta = isExpress ? EXPRESS_ETA : meta.eta;

	return {
		label: meta.label || rate.label,
		eta: eta && CUSTOMS_COUNTRIES.includes( country ) ? `${ eta } (+1–2 days customs)` : eta,
	};
};
