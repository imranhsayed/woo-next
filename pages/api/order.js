import WooCommerceRestApiPkg from "@woocommerce/woocommerce-rest-api";

import { WORDPRESS_URL } from "../../src/constants/urls";

// The package is CommonJS and exposes the class on `.default`, so unwrap it
// explicitly rather than relying on bundler interop.
const WooCommerceRestApi = WooCommerceRestApiPkg.default ?? WooCommerceRestApiPkg;

const api = new WooCommerceRestApi( {
	url: WORDPRESS_URL,
	consumerKey: process.env.WC_CONSUMER_KEY,
	consumerSecret: process.env.WC_CONSUMER_SECRET,
	version: 'wc/v3',
} );

/**
 * Reduce a WooCommerce order to what the confirmation page shows.
 *
 * Only presentational fields are returned — no internal notes or customer ids.
 *
 * @param {Object} order Order from the REST API.
 *
 * @return {Object} Confirmation payload.
 */
const toConfirmation = ( order ) => ( {
	id: order.id,
	number: order.number,
	status: order.status,
	date: order.date_created,
	currency: order.currency,
	paymentMethodTitle: order.payment_method_title,
	paymentMethod: order.payment_method,
	customerNote: order.customer_note ?? '',
	totals: {
		subtotal: ( order.line_items ?? [] ).reduce(
			// Line subtotals are net; add the tax back for a gross figure.
			( sum, item ) => sum + parseFloat( item.subtotal ?? 0 ) + parseFloat( item.subtotal_tax ?? 0 ),
			0
		),
		discount: parseFloat( order.discount_total ?? 0 ) + parseFloat( order.discount_tax ?? 0 ),
		shipping: parseFloat( order.shipping_total ?? 0 ) + parseFloat( order.shipping_tax ?? 0 ),
		vat: parseFloat( order.total_tax ?? 0 ),
		total: parseFloat( order.total ?? 0 ),
	},
	coupons: ( order.coupon_lines ?? [] ).map( ( line ) => ( {
		code: ( line.code ?? '' ).toUpperCase(),
		discount: parseFloat( line.discount ?? 0 ) + parseFloat( line.discount_tax ?? 0 ),
	} ) ),
	shippingLines: ( order.shipping_lines ?? [] ).map( ( line ) => ( {
		title: line.method_title,
		methodId: line.method_id,
	} ) ),
	items: ( order.line_items ?? [] ).map( ( item ) => ( {
		id: item.id,
		name: item.name,
		quantity: item.quantity,
		total: parseFloat( item.subtotal ?? 0 ) + parseFloat( item.subtotal_tax ?? 0 ),
		image: item.image?.src ?? '',
		// Variation attributes arrive as the chosen options on the line item.
		meta: ( item.meta_data ?? [] )
			.filter( ( meta ) => ! String( meta.key ).startsWith( '_' ) )
			.map( ( meta ) => ( { label: meta.display_key ?? meta.key, value: meta.display_value ?? meta.value } ) ),
	} ) ),
	billing: order.billing ?? {},
	shipping: order.shipping ?? {},
} );

/**
 * Read one order for the confirmation page.
 *
 * Guests cannot read orders over GraphQL, so this reads through the REST API
 * server-side. The order key is required and must match, which is the same
 * token WooCommerce's own order-received page relies on — without it, knowing
 * an order id would be enough to see someone else's address.
 *
 * @param {Object} req Request.
 * @param {Object} res Response.
 *
 * @return {Promise<void>}
 */
export default async function handler( req, res ) {

	if ( 'GET' !== req.method ) {
		res.setHeader( 'Allow', 'GET' );
		return res.status( 405 ).json( { error: 'Method Not Allowed' } );
	}

	const { id, key } = req.query;

	if ( ! id || ! key ) {
		return res.status( 400 ).json( { error: 'Both id and key are required' } );
	}

	try {
		const { data } = await api.get( `orders/${ encodeURIComponent( id ) }` );

		if ( ! data?.order_key || data.order_key !== key ) {
			return res.status( 403 ).json( { error: 'Order key does not match' } );
		}

		res.status( 200 ).json( toConfirmation( data ) );
	} catch ( error ) {
		const status = error?.response?.status === 404 ? 404 : 500;

		res.status( status ).json( { error: 404 === status ? 'Order not found' : error.message } );
	}
}
