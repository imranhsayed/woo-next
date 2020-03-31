import { useState, useContext } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { cartData } from "./data";
import { AppContext } from "../context/AppContext";
import { addFirstProduct, updateCart } from "../../functions";
import Link from "next/link";

const GET_CART = gql`
  query GET_CART {
    cart {
      isEmpty
      contents {
        nodes {
          key
          product {
            name
            sku
            slug
          }
          quantity
          subtotal
        }
      }
      subtotal
    }
  }
`;

const ADD_TO_CART = gql`
  mutation ($input: AddToCartInput!) {
    addToCart(input: $input) {
      cartItem {
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
            altText      
          }
          galleryImages {
            nodes {
              id
              sourceUrl
              altText
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
            altText      
          }
          attributes {
            nodes {
              id
              attributeId
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
  }
`;

const CHECKOUT_QUERY = gql`
mutation CHECKOUT_QUERY( $input: CheckoutInput! ) {
        checkout(input: $input ) {
            clientMutationId
            order {
                id
                refunds {
                    nodes {
                        amount
                    }
                }
            }
            customer {
                id
            }
            result
            redirect
        }
}
`;

const AddToCart = ( props ) => {

	const { product, productQryInput } = props;
	const [ cart, setCart ] = useContext( AppContext );
	const [ showViewCart, setShowViewCart ] = useState( false );
	const [ requestError, setRequestError ] = useState( null );

	/**
	 * Handles adding items to the cart.
	 *
	 * @return {void}
	 */
	const handleAddToCartClick = () => {

		// If component is rendered client side.
		if ( process.browser ) {

			let existingCart = localStorage.getItem( 'woo-next-cart' );

			// If cart has item(s) already, update existing or add new item.
			if ( existingCart ) {

				existingCart = JSON.parse( existingCart );

				const qtyToBeAdded = 1;

				const updatedCart = updateCart( existingCart, product, qtyToBeAdded );

				setCart( updatedCart );

			} else {
				/**
				 * If No Items in the cart, create an empty array and add one.
				 * @type {Array}
				 */
				const newCart = addFirstProduct( product );
				setCart( newCart );
			}

			// Show View Cart Button
			setShowViewCart( true )
		}
	};

	// Get Cart Data.
	const { loading, error, data, refetch } = useQuery( GET_CART, {
		notifyOnNetworkStatusChange: true,
		onCompleted: () => {
			console.warn( 'completed GET_CART' );
		}
	} );

	// Add to Cart Mutation.
	const [ addToCart, { loading: addToCartLoading, error: addToCartError }] = useMutation( ADD_TO_CART, {
		variables: {
			input: productQryInput,
		},
		onCompleted: () => {
			console.warn( 'completed ADD_TO_CART' );
			if ( addToCartError ) {
				setRequestError( addToCartError.graphQLErrors[ 0 ].message );
			}
			refetch();
		},
		onError: ( error ) => {
			if ( error ) {
				setRequestError( error.graphQLErrors[ 0 ].message );
			}
		}
	} );


	// Checkout or CreateOrder Mutation.
	const [checkout, { loading: checkoutLoading, error: checkoutError }] = useMutation( CHECKOUT_QUERY, {
		variables: {
			input: cartData
		},
		onCompleted: () => {
			console.warn( 'completed CHECKOUT_QUERY' );
			refetch();
		},
		onError: ( error ) => {
			if ( error ) {
				setRequestError( error.graphQLErrors[ 0 ].message );
			}
		}
	} );

	const handleAddToCart = () => {
		setRequestError( null );
		addToCart();
	};

	const handleCheckout = () => {
		setRequestError( null );
		checkout();
	};

	if (loading) {
		return <p>Loading Live Cart...</p>;
	}
	if (error) {
		return <p>Error: ${error.message}</p>;
	}

	console.warn( 'data', data );

	return (
		<div>
			{/*  Cart Data */}
			{data && <pre>{JSON.stringify(data, null, 2)}</pre>}
			<button onClick={() => handleAddToCart()}>Add To Cart Mutation</button>
			{
				! data.cart.isEmpty && <button onClick={() => handleCheckout()}>Checkout</button>
			}

			{/* Add To Cart Loading*/}
			{addToCartLoading && <p>Adding to Cart...</p>}

			{/* Checkout Loading*/}
			{checkoutLoading && <p>Processing Order...</p>}
			{requestError && <p>Error : { requestError } :( Please try again</p>}

			<button onClick={ handleAddToCartClick } className="btn btn-secondary">Add to cart</button>
			{ showViewCart ? (
				<Link href="/cart"><button className="woo-next-view-cart-btn btn btn-secondary">View Cart</button></Link>
			) : '' }
		</div>
	);
};

export default AddToCart;
