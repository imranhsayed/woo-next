import client from "../components/ApolloClient";
import Router from "next/router";
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
export const handleStripeCheckout = async (input, products, setRequestError, setShowStripeForm, clearCartMutation, setIsStripeOrderProcessing, setCreatedOrderData) => {
    setIsStripeOrderProcessing(true);
    const orderData = getCreateOrderData( input, products );
    const createCustomerOrder = await createTheOrder( orderData, setRequestError,  '' );
    // const cartCleared = await clearTheCart( clearCartMutation, createCustomerOrder?.error );
    setIsStripeOrderProcessing(false);


    // if ( isEmpty( createCustomerOrder?.orderId ) || cartCleared?.error ) {
    //     console.log( 'came in' );
    //     setRequestError('Clear cart failed')
    // 	return null;
    // }

    // On success show stripe form.
    setCreatedOrderData(createCustomerOrder)
    setShowStripeForm(true)

    return createCustomerOrder;
}
