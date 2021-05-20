
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_URL,
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

        await sleep(3000);
    } catch (ex) {
        console.error(ex);
        throw ex;
    }
}

const webhookHandler = async function (request, response) {

    return new Promise((resolve) => {
        if (request.method === 'POST') {
            const sig = request.headers['stripe-signature'];

            let buffer = '';
            request.on('data', (chunk) => {
                buffer += chunk;
            });

            request.on('end', async () => {
                let stripeEvent;
                try {
                    stripeEvent = stripe.webhooks.constructEvent(
                        Buffer.from(buffer).toString(),
                        sig,
                        endpointSecret
                    );
                } catch (err) {
                    // On error, log and return the error message.
                    console.log(`❌ Error message: ${err.message}`);
                    response.status(400).send(`Webhook Error: ${err.message}`);
                    return;
                }

                console.log('✅ Success:', stripeEvent.id);

                /**
                 * Handle Event: 'checkout.session.completed'.
                 */
                if ( 'checkout.session.completed' === stripeEvent.type ) {
                    const session = stripeEvent.data.object;

                    try {
                        console.log( '✅ session.metadata.orderId', session.metadata.orderId, session.id );
                        // Payment Success.
                        await updateOrder( 'processing', session.metadata.orderId, session.id );
                    } catch (err) {
                        await updateOrder( 'failed', session.metadata.orderId );

                        console.error('EXCEPTION handleCheckoutSession', err);
                        response.status(400).send(
                            JSON.stringify({
                                error: `Webhook Error: ${err.toString()}`
                            })
                        );

                        return;
                    }
                }

                response.status(200).send(JSON.stringify({ received: true }));

                // response.json({ received: true });
                resolve();
            });
        } else {
            response.setHeader('Allow', 'POST');
            response.status(405).end('Method Not Allowed');
            resolve();
        }
    });
};

export default webhookHandler;
