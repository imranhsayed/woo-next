import Link from 'next/link';
import { useContext } from 'react';
import { AppContext } from "../../context/AppContext";
import { getFormattedCart, removeItemFromCart } from '../../../functions';
import CartItem from "./CartItem";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

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

const CartItemsContainer = () => {


	// @TODO wil use it in future variations of the project.
	// const [ cart, setCart ] = useContext( AppContext );
	const setCart = () => {};

	// Get Cart Data.
	const { loading, error, data, refetch } = useQuery( GET_CART, {
		notifyOnNetworkStatusChange: true,
		onCompleted: () => {
			console.warn( 'completed GET_CART', data );
		}
	} );

	// console.warn( 'mycart', data );



	const cart = undefined !== data ? getFormattedCart( data ) : null;


	/*
	 * Handle remove product click.
	 *
	 * @param {Object} event event
	 * @param {Integer} Product Id.
	 *
	 * @return {void}
	 */
	const handleRemoveProductClick = ( event, productId ) => {

		const updatedCart = removeItemFromCart( productId );
		setCart( updatedCart );
	};

	return (
		<div>
			{ cart ? (
				<div className="woo-next-cart-wrapper container">
					<h1 className="woo-next-cart-heading mt-5">Cart</h1>
					<table className="table table-hover">
						<thead>
						<tr className="woo-next-cart-head-container">
							<th className="woo-next-cart-heading-el" scope="col"/>
							<th className="woo-next-cart-heading-el" scope="col"/>
							<th className="woo-next-cart-heading-el" scope="col">Product</th>
							<th className="woo-next-cart-heading-el" scope="col">Price</th>
							<th className="woo-next-cart-heading-el" scope="col">Quantity</th>
							<th className="woo-next-cart-heading-el" scope="col">Total</th>
						</tr>
						</thead>
						<tbody>
						{ cart.products.length && (
							cart.products.map( item => (
								<CartItem
									key={ item.productId }
									item={ item }
									handleRemoveProductClick={ handleRemoveProductClick }
									setCart={ setCart }
								/>
							) )
						) }
						</tbody>
					</table>

					{/*Cart Total*/ }
					<div className="row woo-next-cart-total-container mt-5">
						<div className="col-6">
							<h2>Cart Total</h2>
							<table className="table table-hover">
								<tbody>
								<tr className="table-light">
									<td className="woo-next-cart-element-total">Subtotal</td>
									<td className="woo-next-cart-element-amt">{ ( 'string' !== typeof cart.totalProductsPrice ) ? cart.totalProductsPrice.toFixed(2) : cart.totalProductsPrice }</td>
								</tr>
								<tr className="table-light">
									<td className="woo-next-cart-element-total">Total</td>
									<td className="woo-next-cart-element-amt">{ ( 'string' !== typeof cart.totalProductsPrice ) ? cart.totalProductsPrice.toFixed(2) : cart.totalProductsPrice }</td>
								</tr>
								</tbody>
							</table>
							<Link href="/checkout">
								<button className="btn btn-secondary woo-next-large-black-btn">
									<span className="woo-next-cart-checkout-txt">Proceed to Checkout</span>
									<i className="fas fa-long-arrow-alt-right"/>
								</button>
							</Link>
						</div>
					</div>
				</div>
			) : (
				<div className="container mt-5">
					<h2>No items in the cart</h2>
					<Link href="/">
						<button className="btn btn-secondary woo-next-large-black-btn">
							<span className="woo-next-cart-checkout-txt">Add New Products</span>
							<i className="fas fa-long-arrow-alt-right"/>
						</button>
					</Link>
				</div>
			) }
		</div>

	);
};

export default CartItemsContainer;
