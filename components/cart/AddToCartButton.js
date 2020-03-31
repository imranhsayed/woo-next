import { useState, useContext } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { AppContext } from "../context/AppContext";
import { addFirstProduct, getFormattedCart, updateCart } from "../../functions";
import Link from "next/link";
import { v4 } from 'uuid';

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

const AddToCart = ( props ) => {

	const { product } = props;

	const productQryInput = {
		clientMutationId: v4(), // Generate a unique id.
		productId: product.productId,
	};

	const [ cart, setCart ] = useContext( AppContext );
	const [ showViewCart, setShowViewCart ] = useState( false );
	const [ requestError, setRequestError ] = useState( null );

	/**
	 * @TODO will update this in future, when required.
	 * Handles adding items to the cart.
	 *
	 * @return {void}
	 */
	// const handleAddToCartLocalStorage = () => {
	//
	// 	// If component is rendered client side.
	// 	if ( process.browser ) {
	//
	// 		let existingCart = localStorage.getItem( 'woo-next-cart' );
	//
	// 		// If cart has item(s) already, update existing or add new item.
	// 		if ( existingCart ) {
	//
	// 			existingCart = JSON.parse( existingCart );
	//
	// 			const qtyToBeAdded = 1;
	//
	// 			const updatedCart = updateCart( existingCart, product, qtyToBeAdded );
	//
	// 			setCart( updatedCart );
	//
	// 		} else {
	// 			/**
	// 			 * If No Items in the cart, create an empty array and add one.
	// 			 * @type {Array}
	// 			 */
	// 			const newCart = addFirstProduct( product );
	// 			setCart( newCart );
	// 		}
	//
	// 		// Show View Cart Button
	// 		setShowViewCart( true )
	// 	}
	// };

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

	// Add to Cart Mutation.
	const [ addToCart, { data: addToCartRes, loading: addToCartLoading, error: addToCartError }] = useMutation( ADD_TO_CART, {
		variables: {
			input: productQryInput,
		},
		onCompleted: () => {
			// console.warn( 'completed ADD_TO_CART' );

			// If error.
			if ( addToCartError ) {
				setRequestError( addToCartError.graphQLErrors[ 0 ].message );
			}

			// On Success:
			// 1. Make the GET_CART query to update the cart with new values in React context.
			refetch();

			// 2. Show View Cart Button
			setShowViewCart( true )
		},
		onError: ( error ) => {
			if ( error ) {
				setRequestError( error.graphQLErrors[ 0 ].message );
			}
		}
	} );

	const handleAddToCartClick = () => {
		// handleAddToCartLocalStorage();
		setRequestError( null );
		addToCart();
	};

	return (
		<div>
			{/* Add To Cart Loading*/}
			{addToCartLoading && <p>Adding to Cart...</p>}

			{/*	Check if its an external product then put its external buy link */}
			{ "ExternalProduct" === product.__typename ? (
					<a href={ product.externalUrl } target="_blank" className="btn btn-secondary">Buy</a>
				) :
				<button onClick={ handleAddToCartClick } className="btn btn-secondary">Add to cart</button>
			}
			{ showViewCart ? (
				<Link href="/cart"><button className="woo-next-view-cart-btn btn btn-secondary">View Cart</button></Link>
			) : '' }
		</div>
	);
};

export default AddToCart;
