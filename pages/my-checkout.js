import { createCheckoutSession } from 'next-stripe/client'
import { loadStripe } from "@stripe/stripe-js";


export default function MyCheckout() {

    const handleCheckout = async () => {
        const priceOne = 20;
        const priceTwo = 30;
        const session = await createCheckoutSession({
            success_url: window.location.origin + '/thank-you?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: window.location.href,
            line_items: [
                {
                    quantity: 1,
                    name : 'Product One',
                    images: ['https://via.placeholder.com/150'],
                    amount: Math.round(priceOne * 100),
                    currency: 'usd',
                },
                {
                    quantity: 2,
                    name : 'Product Two',
                    images: ['https://via.placeholder.com/150'],
                    amount: Math.round(priceTwo * 100),
                    currency: 'usd',
                }
            ],
            payment_method_types: ['card'],
            mode: 'payment'
        })

        try {
            const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
            if (stripe) {
                stripe.redirectToCheckout({ sessionId: session.id });
            }
        } catch (error) {
            console.log( error );
        }
    }

    return <div>
        <button onClick={handleCheckout}>Checkout</button>
    </div>
}
