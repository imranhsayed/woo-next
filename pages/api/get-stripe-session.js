import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Retrieve a Stripe Checkout Session, used by the thank-you page.
 *
 * @param {Object} req Request.
 * @param {Object} res Response.
 *
 * @return {Promise<void>}
 */
export default async function handler(req, res) {

    const { session_id: sessionId } = req.query;

    if ( ! sessionId ) {
        return res.status(400).json({ error: 'session_id is required' });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        res.status(200).json(session);
    } catch (error) {
        console.error('Stripe session retrieve error', error);
        res.status(500).json({ error: error.message });
    }
}
