import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import axios from "axios";
import Router from "next/router";
import {CARD_OPTIONS} from "../../constants/stripe";

const StripeCheckoutForm = () => {
    const [isProcessing, setProcessingTo] = useState(false);
    const [checkoutError, setCheckoutError] = useState();

    const stripe = useStripe();
    const elements = useElements();

    /**
     * The cardElements onChange prop can be used to
     * add a handler for setting any errors.
     * @param event
     */
    const handleCardDetailsChange = event => {
        event.error ? setCheckoutError(event.error.message) : setCheckoutError();
    };

    const handleFormSubmit = async ev => {
        ev.preventDefault();

        /**
         * We disable the form, until the stripe.js has finished
         * loading.
         */
        if (!stripe || !elements) {
            return;
        }

        const billingDetails = {
            name: 'Imran Sayed',
            email: 'codeytek@gmail.com',
            address: {
                city: 'Pune',
                line1: 'Address 1',
                state: 'my state',
                postal_code: '2200'
            }
        };

        setProcessingTo(true);

        const cardElement = elements.getElement("card");
        const price = 10;

        try {
            const { data: clientSecret } = await axios.post("/api/stripe-payment-intent", {
                amount: price * 100
            });

            const paymentMethodReq = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: billingDetails
            });

            if (paymentMethodReq.error) {
                setCheckoutError(paymentMethodReq.error.message);
                setProcessingTo(false);
                return;
            }

            const { error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethodReq.paymentMethod.id
            });

            if (error) {
                setCheckoutError(error.message);
                setProcessingTo(false);
                return;
            }

            // On successful payment, redirect to thank you page.
            await Router.push("/thank-you")
        } catch (err) {
            setCheckoutError(err.message);
        }
    };

    return (
        <div className="stripe-form-container">
            <form onSubmit={handleFormSubmit} className="stripe-form w-308px lg:w-600px border border px-4 lg:px-8 py-6 lg:py-10 m-auto">
                <h2 className="text-white mb-6 uppercase font-600">Stripe Payment: Pay with card</h2>
                <div className="mb-4">
                    <h6 className="text-sm mb-1 text-white">Card Information</h6>
                    <CardElement
                        options={CARD_OPTIONS}
                        onChange={handleCardDetailsChange}
                    />
                </div>
                {checkoutError ? <div className="text-sm my-4 text-white">{checkoutError}</div> : null}
                <button className="bg-pink-400 hover:bg-pink-300 text-white font-bold py-2 px-4" disabled={isProcessing || !stripe}>
                    {isProcessing ? "Processing..." : `Pay $100`}
                </button>
            </form>
        </div>
    );
};

export default StripeCheckoutForm;
