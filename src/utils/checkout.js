import client from "../components/ApolloClient";
import {isEmpty} from 'lodash';

import GET_STATES from "../queries/get-states";
import {createTheOrder, getCreateOrderData} from "./order";
import {clearTheCart} from "./cart";

/**
 * Get states
 *
 * @param {String} countryCode Country code
 *
 * @returns {Promise<void>}
 */
export const getStates = async ( countryCode ) => {
    const { data } = await client.query( {
        query: GET_STATES,
        variables: { countryCode: countryCode || '' }
    } )

    return data?.wooStates?.states ?? [];
}

/**
 * Set states for the country.
 *
 * @param {Object} target Target.
 * @param {Function} setTheStates React useState function to set the value of the states basis country selection.
 * @param {Function} setIsFetchingStates React useState function, to manage loading state when request is in process.
 *
 * @return {Promise<void>}
 */
export const setStatesForCountry = async ( target, setTheStates, setIsFetchingStates ) => {
    if ( 'country' === target.name ) {
        setIsFetchingStates(true);
        const countryCode = target[target.selectedIndex].getAttribute('data-countrycode')
        const states = await getStates( countryCode );
        setTheStates( states || [] );
        setIsFetchingStates(false);
    }
}

export const handleBillingDifferentThanShipping = ( input, setInput, target ) => {
    const newState = { ...input, [target.name]: ! input.billingDifferentThanShipping };
    setInput( newState );
}

export const handleCreateAccount = ( input, setInput, target ) => {
    const newState = { ...input, [target.name]: ! input.createAccount };
    setInput( newState );
}

/**
 * Handle Stripe checkout.
 *
 * 1. Create Formatted Order data.
 * 2. Create Order using Next.js create-order endpoint.
 * 3. Clear the cart session.
 * 4. On success set show stripe form to true
 *
 * @param input
 * @param products
 * @param setRequestError
 * @param setShowStripeForm
 * @param clearCartMutation
 * @param setIsStripeOrderProcessing
 *
 */
export const handleStripeCheckout = async (input, products, setRequestError, clearCartMutation, setIsStripeOrderProcessing, setCreatedOrderData) => {
    setIsStripeOrderProcessing(true);
    const orderData = getCreateOrderData( input, products );
    const createCustomerOrder = await createTheOrder( orderData, setRequestError,  '' );
    const cartCleared = await clearTheCart( clearCartMutation, createCustomerOrder?.error );
    setIsStripeOrderProcessing(false);


    if ( isEmpty( createCustomerOrder?.orderId ) || cartCleared?.error ) {
        console.log( 'came in' );
        setRequestError('Clear cart failed')
    	return null;
    }

    // On success show stripe form.
    setCreatedOrderData(createCustomerOrder)
    await createCheckoutSessionAndRedirect( products, input, createCustomerOrder );

    return createCustomerOrder;
}

const createCheckoutSessionAndRedirect = async ( products, input, createdOrderData ) => {

    const orderId = createdOrderData?.orderId;

    const sessionData = {
        products,
        currency: createdOrderData?.currency,
        customerEmail: input.billingDifferentThanShipping ? input?.billing?.email : input?.shipping?.email,
        metadata: getMetaData( input, orderId ),
        successUrl: `${window.location.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancelUrl: window.location.href,
    };

    try {
        const response = await fetch( '/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( sessionData ),
        } );

        const session = await response.json();

        if ( ! response.ok || ! session?.url ) {
            console.error( 'Stripe checkout session failed', session?.error );
            return;
        }

        /**
         * Redirect to the Stripe-hosted checkout page.
         * `redirectToCheckout` from @stripe/stripe-js is deprecated in favour of
         * the session url, so the publishable key is no longer needed here.
         */
        window.location.assign( session.url );
    } catch ( error ) {
        console.error( 'Stripe checkout session error', error );
    }
}

/**
 * Get meta data.
 *
 * @param input
 * @param {String} orderId Order Id.
 *
 * @returns {{lineItems: string, shipping: string, orderId, billing: string}}
 */
export const getMetaData = ( input, orderId ) => {

    return {
        billing: JSON.stringify(input?.billing),
        shipping: JSON.stringify(input.billingDifferentThanShipping ? input?.billing?.email : input?.shipping?.email),
        orderId,
    };

    // @TODO
    // if ( customerId ) {
    //     metadata.customerId = customerId;
    // }

}
