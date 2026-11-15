import { useRouter } from 'next/router';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

import CHECKOUT_MUTATION from '../mutations/checkout';
import CLEAR_CART_MUTATION from '../mutations/clear-cart';
import { createTheOrder, getCreateOrderData } from '../utils/order';
import { clearTheCart } from '../utils/cart';
import { toPlainMessage } from '../utils/price';

/**
 * Place the order.
 *
 * Two routes, because the payment is collected in two different places:
 *
 * - A WooCommerce gateway (bank transfer, cash on delivery) is settled outside
 *   the storefront, so the GraphQL `checkout` mutation can create the order and
 *   finish in one step.
 * - Card goes through Stripe, which needs an order to exist before the customer
 *   leaves the site. The order is created first over REST as `pending`, then
 *   the shopper is sent to Stripe and returns to the confirmation page.
 *
 * @return {Object} `placeOrder`, plus `isPlacing` and `error`.
 */
const usePlaceOrder = () => {

	const router = useRouter();

	const [ isPlacing, setPlacing ] = useState( false );
	const [ error, setError ] = useState( '' );

	const [ checkoutMutation ] = useMutation( CHECKOUT_MUTATION );
	const [ clearCartMutation ] = useMutation( CLEAR_CART_MUTATION );

	/**
	 * Send the shopper to the confirmation page.
	 *
	 * The order key travels in the URL because a guest cannot read their own
	 * order without it.
	 *
	 * @param {string|number} id  Order id.
	 * @param {string}        key Order key.
	 */
	const goToConfirmation = ( id, key ) => router.push( `/thank-you?order_id=${ encodeURIComponent( id ) }&key=${ encodeURIComponent( key ) }` );

	/**
	 * Create the order and collect payment.
	 *
	 * @param {Object} input    Checkout form state, see `getCreateOrderData`.
	 * @param {Array}  products Formatted cart products.
	 * @param {Object} totals   Cart totals, used for the Stripe amount.
	 *
	 * @return {Promise<void>}
	 */
	const placeOrder = async ( input, products, totals ) => {

		if ( isPlacing ) {
			return;
		}

		setPlacing( true );
		setError( '' );

		try {
			if ( 'stripe' === input.paymentMethod ) {
				await placeStripeOrder( input, products, totals );
				return;
			}

			await placeGatewayOrder( input );
		} catch ( requestError ) {
			setError( toPlainMessage( requestError?.graphQLErrors?.[ 0 ]?.message ?? requestError?.message ?? 'Something went wrong placing your order.' ) );
			setPlacing( false );
		}
	};

	/**
	 * Order paid through a WooCommerce gateway.
	 *
	 * @param {Object} input Checkout form state.
	 *
	 * @return {Promise<void>}
	 */
	const placeGatewayOrder = async ( input ) => {

		const { data } = await checkoutMutation( {
			variables: {
				input: {
					clientMutationId: uuidv4(),
					paymentMethod: input.paymentMethod,
					isPaid: false,
					customerNote: input.customerNote,
					billing: input.billing,
					shipping: input.shipToDifferent ? input.shipping : input.billing,
					shipToDifferentAddress: !! input.shipToDifferent,
				},
			},
		} );

		const order = data?.checkout?.order;

		if ( ! order ) {
			setError( 'The order could not be created. Please check your details and try again.' );
			setPlacing( false );

			return;
		}

		await goToConfirmation( order.databaseId ?? order.orderNumber, order.orderKey );
	};

	/**
	 * Order paid by card.
	 *
	 * @param {Object} input    Checkout form state.
	 * @param {Array}  products Formatted cart products.
	 * @param {Object} totals   Cart totals.
	 *
	 * @return {Promise<void>}
	 */
	const placeStripeOrder = async ( input, products, totals ) => {

		const created = await createTheOrder( getCreateOrderData( input, products ), setError, '' );

		if ( ! created.orderId || created.error ) {
			setPlacing( false );
			return;
		}

		// The cart has become an order; empty it before leaving for Stripe.
		await clearTheCart( clearCartMutation, '' );

		const response = await fetch( '/api/create-checkout-session', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify( {
				currency: created.currency || 'EUR',
				amountTotal: totals.total,
				amountLabel: `WooNext order #${ created.orderNumber || created.orderId }`,
				customerEmail: input.billing.email,
				metadata: { orderId: String( created.orderId ), orderKey: created.orderKey },
				successUrl: `${ window.location.origin }/thank-you?order_id=${ created.orderId }&key=${ created.orderKey }&session_id={CHECKOUT_SESSION_ID}`,
				cancelUrl: `${ window.location.origin }/checkout?cancelled=1`,
			} ),
		} );

		const session = await response.json();

		if ( ! response.ok || ! session?.url ) {
			setError( session?.error ?? 'The payment page could not be opened. Your order was saved — contact us and we will help you pay for it.' );
			setPlacing( false );

			return;
		}

		window.location.assign( session.url );
	};

	return { placeOrder, isPlacing, error, setError };
};

export default usePlaceOrder;
