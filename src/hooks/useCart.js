import { useContext, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

import { AppContext } from '../components/context/AppContext';
import { getFormattedCart, getUpdatedItems } from '../functions';
import GET_CART from '../queries/get-cart';
import UPDATE_CART from '../mutations/update-cart';
import {
	APPLY_COUPON,
	REMOVE_COUPONS,
	UPDATE_SHIPPING_COUNTRY,
	UPDATE_SHIPPING_METHOD,
} from '../mutations/cart-actions';
import { toPlainMessage } from '../utils/price';

/**
 * The live WooCommerce cart.
 *
 * Reads the session cart, keeps `AppContext` and localStorage in sync so the
 * header badge has a value before the query resolves, and exposes the actions
 * the drawer and cart page need: quantities, removal, coupons, shipping
 * choice and the delivery country.
 *
 * @return {Object} Cart state and mutators.
 */
const useCart = () => {

	const [ cart, setCart ] = useContext( AppContext );
	const [ requestError, setRequestError ] = useState( null );

	const { data, loading, refetch } = useQuery( GET_CART, {
		notifyOnNetworkStatusChange: true,
	} );

	useEffect( () => {

		if ( ! data ) {
			return;
		}

		const updatedCart = getFormattedCart( data );

		try {
			localStorage.setItem( 'woo-next-cart', JSON.stringify( updatedCart ) );
		} catch ( error ) {
			// Storage can be unavailable; context still holds the cart.
		}

		setCart( updatedCart );
	}, [ data, setCart ] );

	/**
	 * Wrap a cart mutation so every one reports failures the same way and
	 * refreshes the cart afterwards.
	 *
	 * @param {Object} document GraphQL document.
	 *
	 * @return {Array} The `useMutation` tuple.
	 */
	const mutationOptions = {
		onCompleted: () => refetch(),
		onError: ( error ) => setRequestError(
			toPlainMessage( error?.graphQLErrors?.[ 0 ]?.message ?? error.message )
		),
	};

	const [ updateCart, { loading: updating } ] = useMutation( UPDATE_CART, mutationOptions );
	const [ applyCouponMutation, { loading: applyingCoupon } ] = useMutation( APPLY_COUPON, mutationOptions );
	const [ removeCouponsMutation ] = useMutation( REMOVE_COUPONS, mutationOptions );
	const [ updateShippingMethodMutation, { loading: updatingShipping } ] = useMutation( UPDATE_SHIPPING_METHOD, mutationOptions );
	const [ updateCountryMutation, { loading: updatingCountry } ] = useMutation( UPDATE_SHIPPING_COUNTRY, mutationOptions );

	const products = cart?.products ?? [];

	/**
	 * Write new quantities for one or more lines.
	 *
	 * WooCommerce's `updateItemQuantities` replaces the whole set of lines, so
	 * every other line has to be sent back at its current quantity. A quantity
	 * of 0 removes the line.
	 *
	 * @param {Object} changes Cart key to new quantity.
	 *
	 * @return {Promise} Resolves once the mutation settles.
	 */
	const setQuantities = ( changes ) => {

		setRequestError( null );

		// Start from the current lines, then overlay each requested change.
		const items = products.map( ( product ) => ( {
			key: product.cartKey,
			quantity: Object.prototype.hasOwnProperty.call( changes, product.cartKey )
				? parseInt( changes[ product.cartKey ], 10 )
				: product.qty,
		} ) );

		return updateCart( {
			variables: { input: { clientMutationId: uuidv4(), items } },
		} );
	};

	const setQuantity = ( cartKey, quantity ) => {

		setRequestError( null );

		return updateCart( {
			variables: {
				input: {
					clientMutationId: uuidv4(),
					items: getUpdatedItems( products, quantity, cartKey ),
				},
			},
		} );
	};

	const removeItem = ( cartKey ) => setQuantity( cartKey, 0 );

	/**
	 * Apply a coupon code.
	 *
	 * @param {string} code Coupon code.
	 *
	 * @return {Promise<{ok: boolean, message: string}>} Outcome for the form.
	 */
	const applyCoupon = async ( code ) => {

		setRequestError( null );

		try {
			await applyCouponMutation( {
				variables: { input: { clientMutationId: uuidv4(), code } },
				onError: undefined, // Handled here so the form can show it inline.
			} );

			return { ok: true, message: '' };
		} catch ( error ) {
			return {
				ok: false,
				message: toPlainMessage( error?.graphQLErrors?.[ 0 ]?.message ?? error.message ),
			};
		}
	};

	const removeCoupon = ( code ) => removeCouponsMutation( {
		variables: { input: { clientMutationId: uuidv4(), codes: [ code ] } },
	} );

	const setShippingMethod = ( rateId ) => updateShippingMethodMutation( {
		variables: { input: { clientMutationId: uuidv4(), shippingMethods: [ rateId ] } },
	} );

	const setShippingCountry = ( country ) => updateCountryMutation( {
		variables: { input: { clientMutationId: uuidv4(), shipping: { country } } },
	} );

	return useMemo( () => ( {
		cart,
		products,
		count: cart?.totalProductsCount ?? 0,
		total: cart?.totalProductsPrice ?? '',
		subtotal: cart?.subtotal ?? '',
		subtotalValue: cart?.subtotalValue ?? 0,
		totals: cart?.totals ?? null,
		coupons: cart?.coupons ?? [],
		shippingRates: cart?.shippingRates ?? [],
		chosenShippingMethod: cart?.chosenShippingMethod ?? '',
		needsShippingAddress: cart?.needsShippingAddress ?? false,
		isEmpty: ! products.length,
		loading,
		updating: updating || applyingCoupon || updatingShipping || updatingCountry,
		requestError,
		clearError: () => setRequestError( null ),
		setQuantity,
		setQuantities,
		removeItem,
		applyCoupon,
		removeCoupon,
		setShippingMethod,
		setShippingCountry,
		refetch,
	} ), [ cart, products, loading, updating, applyingCoupon, updatingShipping, updatingCountry, requestError ] ); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useCart;
