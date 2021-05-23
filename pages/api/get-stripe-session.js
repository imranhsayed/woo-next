const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {

    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    res.status(200).json(session);
};
