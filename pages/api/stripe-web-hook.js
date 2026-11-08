import Stripe from 'stripe';
import { WORDPRESS_URL } from "../../src/constants/urls";
import WooCommerceRestApiPkg from "@woocommerce/woocommerce-rest-api";

// The package is CommonJS and exposes the class on `.default`, so unwrap it
// explicitly rather than relying on bundler interop.
const WooCommerceRestApi = WooCommerceRestApiPkg.default ?? WooCommerceRestApiPkg;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;

export const config = {
    api: {
        bodyParser: false,
    },
};

/**
 * Read the raw request body.
 *
 * Stripe signature verification needs the unparsed payload, which is why
 * `bodyParser` is disabled above. Replaces the `micro` package's `buffer()`.
 *
 * @param {Object} req Request.
 *
 * @returns {Promise<Buffer>} Raw request body.
 */
const getRawBody = async ( req ) => {
    const chunks = [];

    for await ( const chunk of req ) {
        chunks.push( typeof chunk === 'string' ? Buffer.from( chunk ) : chunk );
    }

    return Buffer.concat( chunks );
};

const api = new WooCommerceRestApi({
    url: WORDPRESS_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: "wc/v3"
});

/**
 * Update Order.
 *
 * Once payment is successful or failed,
 * Update Order Status to 'Processing' or 'Failed' and set the transaction id.
 *
 * @param {String} newStatus Order Status to be updated.
 * @param {String} orderId Order id
 * @param {String} transactionId Transaction id.
 *
 * @returns {Promise<void>}
 */
const updateOrder = async ( newStatus, orderId, transactionId = '' ) => {

    let newOrderData = {
        status: newStatus
    }

    if ( transactionId ) {
        newOrderData.transaction_id = transactionId
    }

    try {
        const {data} = await api.put( `orders/${ orderId }`, newOrderData );
        console.log( '✅ Order updated data', data );
    } catch (ex) {
        console.error('Order creation error', ex);
        throw ex;
    }
}

const handler = async (req, res) => {
    if (req.method === "POST") {
        const buf = await getRawBody(req);
        const sig = req.headers["stripe-signature"];

        let stripeEvent;

        try {
            stripeEvent = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
            console.log( 'stripeEvent', stripeEvent );
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        if ( 'checkout.session.completed' === stripeEvent.type ) {
            const session = stripeEvent.data.object;
            console.log( 'sessionsession', session );
            console.log( '✅ session.metadata.orderId', session.metadata.orderId, session.id );
            // Payment Success.
            try {
                await updateOrder( 'processing', session.metadata.orderId, session.id );
            } catch (error) {
                await updateOrder( 'failed', session.metadata.orderId );
                console.error('Update order error', error);
            }
        }

        res.json({ received: true });
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
};

export default handler;
