import Stripe from 'stripe';
import { isArray, isEmpty } from 'lodash';

const stripe = new Stripe( process.env.STRIPE_SECRET_KEY );

/**
 * Get line items in the shape the Stripe Checkout Sessions API expects.
 *
 * @see https://docs.stripe.com/api/checkout/sessions/create#create_checkout_session-line_items
 *
 * @param {Array} products Cart products.
 * @param {String} currency Lowercase ISO currency code.
 *
 * @return {Array} Stripe line items.
 */
const getStripeLineItems = ( products, currency ) => {

    if ( isEmpty( products ) || ! isArray( products ) ) {
        return [];
    }

    return products.map( ( product ) => {
        // Stripe rejects empty strings, so only send images we actually have.
        const images = [ product?.image?.sourceUrl ].filter( Boolean );

        return {
            quantity: product?.qty ?? 0,
            price_data: {
                currency,
                // `price` is the per-unit price; Stripe multiplies it by quantity.
                unit_amount: Math.round( ( product?.price ?? 0 ) * 100 ),
                product_data: {
                    name: product?.name ?? '',
                    ...( images.length ? { images } : {} ),
                },
            },
        };
    } );
};

/**
 * Create a Stripe Checkout Session.
 *
 * Replaces the abandoned `next-stripe` package, which pinned stripe@8.
 *
 * @param {Object} req Request.
 * @param {Object} res Response.
 *
 * @return {Promise<void>} Responds with the session id and hosted checkout url.
 */
export default async function handler( req, res ) {

    if ( 'POST' !== req.method ) {
        res.setHeader( 'Allow', 'POST' );
        return res.status( 405 ).json( { error: 'Method Not Allowed' } );
    }

    const { products, customerEmail, metadata, currency, successUrl, cancelUrl } = req.body ?? {};

    if ( isEmpty( products ) ) {
        return res.status( 400 ).json( { error: 'Required data not sent' } );
    }

    try {
        const session = await stripe.checkout.sessions.create( {
            mode: 'payment',
            /**
             * `payment_method_types` is no longer a documented create param on
             * current Stripe API versions. Payment methods now come from the
             * ones enabled in the Stripe Dashboard (dynamic payment methods).
             * To restrict them here, use `allowed_payment_method_types`.
             */
            line_items: getStripeLineItems( products, ( currency || 'usd' ).toLowerCase() ),
            customer_email: customerEmail,
            metadata,
            success_url: successUrl,
            cancel_url: cancelUrl,
        } );

        res.status( 200 ).json( { id: session.id, url: session.url } );
    } catch ( error ) {
        console.error( 'Stripe checkout session error', error );
        res.status( 500 ).json( { error: error.message } );
    }
}
