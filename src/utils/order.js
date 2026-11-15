import { isArray, isEmpty } from "lodash";

/**
 * Turn an address from the checkout form into the shape the REST API wants.
 *
 * @param {Object} address Form address.
 *
 * @return {Object} REST address.
 */
const toRestAddress = ( address = {} ) => ( {
	first_name: address.firstName ?? '',
	last_name: address.lastName ?? '',
	company: address.company ?? '',
	address_1: address.address1 ?? '',
	address_2: address.address2 ?? '',
	city: address.city ?? '',
	state: address.state ?? '',
	postcode: address.postcode ?? '',
	country: address.country ?? '',
	email: address.email ?? '',
	phone: address.phone ?? '',
} );

/**
 * Line items for order creation.
 *
 * A variable product must carry its `variation_id`, otherwise WooCommerce
 * records the parent and the order loses the size and colour the customer
 * chose — and prices it from the parent rather than the variation.
 *
 * @param {Array} products Formatted cart products.
 *
 * @return {Array} REST line items.
 */
export const getCreateOrderLineItems = ( products ) => {

	if ( isEmpty( products ) || ! isArray( products ) ) {
		return [];
	}

	return products.map( ( { productId, variationId, qty: quantity } ) => ( {
		quantity,
		product_id: productId,
		...( variationId ? { variation_id: variationId } : {} ),
	} ) );
};

/**
 * Order payload for `POST /api/create-order`.
 *
 * Shipping and coupon lines are included so the order WooCommerce records
 * totals the same as the cart the customer agreed to. Without them the order
 * would be cheaper than the cart — no delivery charge — while still showing
 * the customer the higher figure.
 *
 * @param {Object} input    `{ billing, shipping, shipToDifferent, paymentMethod, paymentMethodTitle, customerNote, shippingLine, coupons }`.
 * @param {Array}  products Formatted cart products.
 *
 * @return {Object} REST order payload.
 */
export const getCreateOrderData = ( input, products ) => {

	// Billing is the address always collected; shipping falls back to it.
	const shippingAddress = input.shipToDifferent ? input.shipping : input.billing;

	const data = {
		payment_method: input.paymentMethod ?? 'stripe',
		payment_method_title: input.paymentMethodTitle ?? 'Card',
		customer_note: input.customerNote ?? '',
		billing: toRestAddress( input.billing ),
		shipping: toRestAddress( { ...shippingAddress, email: '', phone: '' } ),
		line_items: getCreateOrderLineItems( products ),
	};

	if ( input.shippingLine?.title ) {
		data.shipping_lines = [ {
			method_id: input.shippingLine.methodId ?? '',
			method_title: input.shippingLine.title,
			// REST expects the net amount as a string.
			total: String( input.shippingLine.total ?? 0 ),
		} ];
	}

	if ( ! isEmpty( input.coupons ) ) {
		data.coupon_lines = input.coupons.map( ( code ) => ( { code: String( code ).toLowerCase() } ) );
	}

	return data;
};

/**
 * Create the order through the Next.js REST endpoint.
 *
 * @param {Object}   orderData            Order payload.
 * @param {Function} setOrderFailedError  Reports a failure to the page.
 * @param {string}   previousRequestError Error from an earlier step, if any.
 *
 * @return {Promise<{orderId: string, orderKey: string, total: string, currency: string, error: string}>}
 */
export const createTheOrder = async ( orderData, setOrderFailedError, previousRequestError ) => {

	const response = {
		orderId: null,
		orderKey: '',
		total: '',
		currency: '',
		error: '',
	};

	// Don't proceed if a previous request already failed.
	if ( previousRequestError ) {
		response.error = previousRequestError;
		return response;
	}

	setOrderFailedError( '' );

	try {
		const request = await fetch( '/api/create-order', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify( orderData ),
		} );

		const result = await request.json();

		if ( result.error ) {
			response.error = result.error;
			setOrderFailedError( 'Something went wrong creating your order. Please try again.' );

			return response;
		}

		response.orderId = result?.orderId ?? '';
		response.orderKey = result?.orderKey ?? '';
		response.total = result?.total ?? '';
		response.currency = result?.currency ?? '';
	} catch ( error ) {
		response.error = error?.message ?? 'Order creation failed';
		setOrderFailedError( 'Something went wrong creating your order. Please try again.' );
	}

	return response;
};
