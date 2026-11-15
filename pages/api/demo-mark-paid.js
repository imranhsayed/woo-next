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
 * Move an order to `processing`, as the Stripe webhook would.
 *
 * Local development has no public URL for Stripe to call, so a card order sits
 * at `pending` after a successful test payment. This stands in for that single
 * webhook step while capturing demo recordings.
 *
 * Development only — it refuses to run otherwise, since anything that can
 * mark orders paid without checking payment has no business in production.
 *
 * @param {Object} req Request.
 * @param {Object} res Response.
 *
 * @return {Promise<void>}
 */
export default async function handler( req, res ) {

	if ( 'development' !== process.env.NODE_ENV ) {
		return res.status( 404 ).json( { error: 'Not found' } );
	}

	if ( 'POST' !== req.method ) {
		res.setHeader( 'Allow', 'POST' );
		return res.status( 405 ).json( { error: 'Method Not Allowed' } );
	}

	const { id } = req.query;

	if ( ! id ) {
		return res.status( 400 ).json( { error: 'id is required' } );
	}

	try {
		const { data } = await api.put( `orders/${ encodeURIComponent( id ) }`, { status: 'processing' } );

		res.status( 200 ).json( { id: data.id, status: data.status } );
	} catch ( error ) {
		res.status( 500 ).json( { error: error.message } );
	}
}
