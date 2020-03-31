import { useState, useContext, useEffect } from 'react';
import Billing from "./Billing";
import YourOrder from "./YourOrder";
import PaymentModes from "./PaymentModes";
import { AppContext } from "../context/AppContext";
import validateAndSanitizeCheckoutForm from '../../validator/checkout';
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { getFormattedCart, createCheckoutData } from "../../functions";
import OrderSuccess from "./OrderSucess";

const GET_CART = gql`
  query GET_CART {
    cart {
      contents {
        nodes {
          key
          product {
            id
            productId
            name
            description
            type
            onSale
            slug
            averageRating
            reviewCount
            image {
              id
                sourceUrl
                srcSet
                altText
                title       
            }
            galleryImages {
              nodes {
                id
                sourceUrl
                srcSet
                altText
                title   
              }
            }

          }
          variation {
            id
            variationId
            name
            description
            type
            onSale
            price
            regularPrice
            salePrice
            image {
              id
              sourceUrl
              srcSet
              altText
              title      
            }
            attributes {
              nodes {
                id
                name
                value
              }
            }
          }
          quantity
          total
          subtotal
          subtotalTax
        }
      }
      appliedCoupons {
        nodes {
          couponId
          discountType
          amount
          dateExpiry
          products {
            nodes {
              id
            }
          }
          productCategories {
            nodes {
              id
            }
          }
        }
      }
      subtotal
      subtotalTax
      shippingTax
      shippingTotal
      total
      totalTax
      feeTax
      feeTotal
      discountTax
      discountTotal
    }
  }
`;

const CHECKOUT_QUERY = gql`
mutation CHECKOUT_QUERY( $input: CheckoutInput! ) {
  checkout(input: $input) {
    clientMutationId
    order {
      id
      orderId
      refunds {
        nodes {
          amount
        }
      }
      status
    }
    result
    redirect
  }
}
`;

const CheckoutForm = () => {

	// const initialState = {
	// 	firstName: '',
	// 	lastName: '',
	// 	company: '',
	// 	country: '',
	// 	address1: '',
	// 	address2: '',
	// 	city: '',
	// 	state: '',
	// 	postcode: '',
	// 	phone: '',
	// 	email: '',
	// 	createAccount: false,
	// 	orderNotes: '',
	// 	paymentMethod: '',
	// 	errors: null
	// };

	const initialState = {
		firstName: 'Imran',
		lastName: 'Sayed',
		address1: '109 Hills Road Valley',
		address2: 'Station Road',
		city: 'Pune',
		state: 'Maharastra',
		country: 'ID',
		postcode: '400298',
		phone: '9959338989',
		email: 'imran@gmail.com',
		company: 'Tech',
		createAccount: false,
		orderNotes: '',
		paymentMethod: 'cod',
		errors: null
	};

	const [ cart, setCart ] = useContext( AppContext );
	const [ input, setInput ] = useState( initialState );
	const [ orderData, setOrderData ] = useState( null );
	const [ requestError, setRequestError ] = useState( null );

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
	const [ checkout, { data: checkoutResponse, loading: checkoutLoading, error: checkoutError } ] = useMutation( CHECKOUT_QUERY, {
		variables: {
			input: orderData
		},
		onCompleted: () => {
			// console.warn( 'completed CHECKOUT_QUERY' );
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
		const result = validateAndSanitizeCheckoutForm( input );
		if ( ! result.isValid ) {
			setInput( { ...input,  errors: result.errors } );
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
	 *
	 * @return {void}
	 */
	const handleOnChange = ( event ) => {

		if ( 'createAccount' === event.target.name ) {
			const newState = { ...input, [event.target.name]: ! input.createAccount };
			setInput( newState );
		} else {
			const newState = { ...input, [event.target.name]: event.target.value };
			setInput( newState );
		}
	};

	useEffect( () => {

		if ( null !== orderData ) {
			// Call the checkout mutation when the value for orderData changes/updates.
			checkout();
		}

	}, [ orderData ] );

	return (
		<>
			{ cart ? (
				<form onSubmit={ handleFormSubmit } className="woo-next-checkout-form">
					<div className="row">
						{/*Billing Details*/}
						<div className="col-lg-6 col-md-12 p-0 pr-2">
							<h2 className="mb-4">Billing Details</h2>
							<Billing input={ input } handleOnChange={ handleOnChange }/>
						</div>
						{/* Order & Payments*/}
						<div className="col-lg-6 col-md-12">
							{/*	Order*/}
							<h2 className="mb-4">Your Order</h2>
							<YourOrder cart={ cart }/>

							{/*Payment*/}
							<PaymentModes input={ input } handleOnChange={ handleOnChange }/>
							<div className="woo-next-place-order-btn-wrap mt-5">
								<button className="btn woo-next-large-black-btn woo-next-place-order-btn btn-secondary" type="submit">
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
