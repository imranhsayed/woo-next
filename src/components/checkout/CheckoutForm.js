import { useState, useContext, useEffect } from 'react';
import YourOrder from "./YourOrder";
import PaymentModes from "./PaymentModes";
import { AppContext } from "../context/AppContext";
import validateAndSanitizeCheckoutForm from '../../validator/checkout';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import { getFormattedCart, createCheckoutData } from "../../functions";
import OrderSuccess from "./OrderSuccess";
import GET_CART from "../../queries/get-cart";
import CHECKOUT_MUTATION from "../../mutations/checkout";
import Address from "./Address";
import GET_STATES from "../../queries/get-states";

// Use this for testing purposes, so you dont have to fill the checkout form over an over again.
// const defaultCustomerInfo = {
// 	firstName: 'Imran',
// 	lastName: 'Sayed',
// 	address1: '123 Abc farm',
// 	address2: 'Hill Road',
// 	city: 'Mumbai',
// 	country: 'IN',
// 	state: 'Maharastra',
// 	postcode: '221029',
// 	email: 'codeytek.academy@gmail.com',
// 	phone: '9883778278',
// 	company: 'The Company',
// 	errors: null
// }

const defaultCustomerInfo = {
	firstName: '',
	lastName: '',
	address1: '',
	address2: '',
	city: '',
	country: '',
	state: '',
	postcode: '',
	email: '',
	phone: '',
	company: '',
	errors: null
}

const CheckoutForm = ({countriesData}) => {

	const {billingCountries, shippingCountries} = countriesData || {}

	const initialState = {
		billing: {
			...defaultCustomerInfo,
		},
		shipping: {
			...defaultCustomerInfo
		},
		createAccount: false,
		orderNotes: '',
		paymentMethod: '',
	};

	const [ cart, setCart ] = useContext( AppContext );
	const [ input, setInput ] = useState( initialState );
	const [ orderData, setOrderData ] = useState( null );
	const [ requestError, setRequestError ] = useState( null );
	const [theBillingStates, setTheBillingStates] = useState([]);
	const [theShippingStates, setTheShippingStates] = useState([]);

	const [getStates, { data: billingStates, loading: billingStatesLoading, error: billingStatesError }] = useLazyQuery( GET_STATES );

	// Get Cart Data.
	const { loading, error, data, refetch } = useQuery( GET_CART, {
		notifyOnNetworkStatusChange: true,
		onCompleted: () => {
			// console.warn( 'completed GET_CART' );

			// Update cart in the localStorage.
			const updatedCart = getFormattedCart( data );
			localStorage.setItem( 'woo-next-cart', JSON.stringify( updatedCart ) );

			// Update cart data in React Context.
			setCart( updatedCart );
		}
	} );

	// Checkout or CreateOrder Mutation.
	const [ checkout, { data: checkoutResponse, loading: checkoutLoading, error: checkoutError } ] = useMutation( CHECKOUT_MUTATION, {
		variables: {
			input: orderData
		},
		onCompleted: () => {
			// console.warn( 'completed CHECKOUT_MUTATION' );
			refetch();
		},
		onError: ( error ) => {
			if ( error ) {
				setRequestError( error.graphQLErrors[ 0 ].message );
			}
		}
	} );

	/*
	 * Handle form submit.
	 *
	 * @param {Object} event Event Object.
	 *
	 * @return {void}
	 */
	const handleFormSubmit = ( event ) => {
		event.preventDefault();

		// Validate Billing and Shipping Details
		const billingValidationResult = validateAndSanitizeCheckoutForm( input?.billing );
		const shippingValidationResult = validateAndSanitizeCheckoutForm( input?.shipping );

		if ( ! shippingValidationResult.isValid || !billingValidationResult.isValid ) {
			setInput({
				...input,
				billing: {...input.billing, errors: billingValidationResult.errors},
				shipping: {...input.shipping, errors: shippingValidationResult.errors}
			});

			return;
		}

		const checkOutData = createCheckoutData( input );
		setOrderData( checkOutData );
		setRequestError( null );
	};

	/*
	 * Handle onchange input.
	 *
	 * @param {Object} event Event Object.
	 * @param {bool} isShipping is Shipping If this is false it means it is billing.
	 *
	 * @return {void}
	 */
	const handleOnChange = ( event, isShipping ) => {

		const {target}= event || {};

		if ( 'createAccount' === target.name ) {
			const newState = { ...input, [target.name]: ! input.createAccount };
			setInput( newState );
		} else {
			if ( isShipping ) {
				handleShippingChange( target )
			} else {
				handleBillingChange( target )
			}
		}
	};

	const handleShippingChange = async (target) => {
		const newState = { ...input, shipping: { ...input?.shipping, [target.name]: target.value } };
		setInput( newState );

		if ( 'country' === target.name ) {
			const countryCode = target[target.selectedIndex].getAttribute('data-countrycode')
			const shippingStates = await getStates({
				variables: { countryCode: countryCode || '' }
			});
			setTheShippingStates( shippingStates?.wooStates?.states ?? [] );
		}
	}

	const handleBillingChange = (target) => {
		const newState = { ...input, billing: { ...input?.billing, [target.name]: target.value } };
		setInput( newState );
	}

	useEffect( () => {

		if ( null !== orderData ) {
			// Call the checkout mutation when the value for orderData changes/updates.
			checkout();
		}

	}, [ orderData ] );

	console.log( 'billingStates', billingStates );

	return (
		<>
			{ cart ? (
				<form onSubmit={ handleFormSubmit } className="woo-next-checkout-form">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-20">
						<div>
							{/*Shipping Details*/}
							<div className="billing-details">
								<h2 className="text-xl font-medium mb-4">Shipping Details</h2>
								<Address states={theBillingStates} countries={billingCountries} input={ input?.shipping } handleOnChange={ (event) => handleOnChange(event, true) }/>
							</div>
							{/*Billing Details*/}
							<div className="billing-details">
								<h2 className="text-xl font-medium mb-4">Billing Details</h2>
								<Address states={theShippingStates} countries={shippingCountries} input={ input?.billing } handleOnChange={ (event) => handleOnChange(event, false) }/>
							</div>
						</div>
						{/* Order & Payments*/}
						<div className="your-orders">
							{/*	Order*/}
							<h2 className="text-xl font-medium mb-4">Your Order</h2>
							<YourOrder cart={ cart }/>

							{/*Payment*/}
							<PaymentModes input={ input } handleOnChange={ handleOnChange }/>
							<div className="woo-next-place-order-btn-wrap mt-5">
								<button className="bg-purple-600 text-white px-5 py-3 rounded-sm w-auto xl:w-full" type="submit">
									Place Order
								</button>
							</div>

							{/* Checkout Loading*/}
							{checkoutLoading && <p>Processing Order...</p>}
							{requestError && <p>Error : { requestError } :( Please try again</p>}
						</div>
					</div>
				</form>
			) : '' }

		{/*	Show message if Order Sucess*/}
		<OrderSuccess response={ checkoutResponse }/>
		</>
	);
};

export default CheckoutForm;
