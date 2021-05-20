const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (!req.body || req.method !== 'POST') {
        return {
            statusCode: 301,
            body: JSON.stringify({
                status: 'invalid-method'
            })
        };
    }
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.status(200).send(JSON.stringify(session));
};
