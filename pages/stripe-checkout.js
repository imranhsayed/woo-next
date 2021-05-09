import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripeCheckoutForm from "../src/components/stripe/stripe-checkout-form";

const StripeCheckout = () => {

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    return (
        <Elements stripe={stripePromise}>
            <StripeCheckoutForm/>
        </Elements>
    );
};

export default StripeCheckout;
