import {isArray, isEmpty} from "lodash";

/**
 * Get line items for stripe
 *
 * @param {array} products Products.
 *
 * @returns {*[]|*} Line items, Array of objects.
 */
export const getStripeLineItems = ( products ) => {

    if ( isEmpty( products ) || !isArray( products ) ) {
        return []
    }

    return products?.map(
        ( { productId, name, price, qty: quantity, image } ) => {
            return {
                price: price?.toString(), // The reason we pass price here and not total, because stripe multiplies it with qty.
                quantity,
                name,
                image,
                productId,
            };
        },
    );
}

/**
 * Get line items for create order
 *
 * @param {array} products Products.
 *
 * @returns {*[]|*} Line items, Array of objects.
 */
export const getCreateOrderLineItems = (products) => {

    if (isEmpty(products) || !isArray( products )) {
        return []
    }

    console.log( 'products', products );

    return products?.map(
        ({productId, qty: quantity}) => {
            return {
                quantity,
                product_id: productId,
                // variation_id: '', // @TODO to be added.
            };
        },
    );
}

/**
 * Get Formatted create order data.
 *
 * @param order
 * @param products
 * @return {{shipping: {country: *, city: *, phone: *, address_1: (string|*), address_2: (string|*), postcode: (string|*), last_name: (string|*), company: *, state: *, first_name: (string|*), email: *}, payment_method_title: string, line_items: (*[]|*), payment_method: string, billing: {country: *, city: *, phone: *, address_1: (string|*), address_2: (string|*), postcode: (string|*), last_name: (string|*), company: *, state: *, first_name: (string|*), email: *}}}
 */
export const getCreateOrderData = (order, products) => {
    // Set the billing Data to shipping, if applicable.
    const billingData = order.billingDifferentThanShipping ? order.billing : order.shipping;

    // Checkout data.
    return {
        shipping: {
            first_name: order?.shipping?.firstName,
            last_name: order?.shipping?.lastName,
            address_1: order?.shipping?.address1,
            address_2: order?.shipping?.address2,
            city: order?.shipping?.city,
            country: order?.shipping?.country,
            state: order?.shipping?.state,
            postcode: order?.shipping?.postcode,
            email: order?.shipping?.email,
            phone: order?.shipping?.phone,
            company: order?.shipping?.company,
        },
        billing: {
            first_name: billingData?.firstName,
            last_name: billingData?.lastName,
            address_1: billingData?.address1,
            address_2: billingData?.address2,
            city: billingData?.city,
            country: billingData?.country,
            state: billingData?.state,
            postcode: billingData?.postcode,
            email: billingData?.email,
            phone: billingData?.phone,
            company: billingData?.company,
        },
        payment_method: 'stripe',
        payment_method_title: 'Stripe',
        line_items: getCreateOrderLineItems( products ),
    };
}

/**
 * Create order.
 *
 * @param {Object} orderData Order data.
 * @param {function} setOrderFailedError sets the react state to true if the order creation fails.
 * @param {string} previousRequestError Previous request error.
 *
 * @returns {Promise<{orderId: null, error: string}>}
 */
export const createTheOrder = async ( orderData, setOrderFailedError, previousRequestError ) => {
    let response = {
        orderId: null,
        total: '',
        currency: '',
        error: ''
    };

    // Don't proceed if previous request has error.
    if ( previousRequestError ) {
        response.error = previousRequestError;
        return response;
    }

    setOrderFailedError( '' );

    try {
        const request = await fetch( '/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify( orderData ),
        } );

        const result = await request.json();
        if ( result.error ) {
            response.error = result.error
            setOrderFailedError( 'Something went wrong. Order creation failed. Please try again' );
        }
        response.orderId = result?.orderId ?? '';
        response.total = result.total ?? '';
        response.currency = result.currency ?? '';

    } catch ( error ) {
        // @TODO to be handled later.
        console.warn( 'Handle create order error', error?.message );
    }

    return response;
}
