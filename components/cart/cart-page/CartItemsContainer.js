import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from "../../context/AppContext";
import { getFormattedCart, removeItemFromCart } from '../../../functions';
import CartItem from "./CartItem";
import { v4 } from 'uuid';
import { useMutation, useQuery } from "@apollo/react-hooks";
import UPDATE_CART from "../../../mutations/update-cart";
import GET_CART from "../../../queries/get-cart";


const CartItemsContainer = () => {


	// @TODO wil use it in future variations of the project.
	const [ cart, setCart ] = useContext( AppContext );

	const [processing, setProcessing]     = useState( false );
	const [requestError, setRequestError] = useState( null );

	// Get Cart Data.
	const { loading, error, data, refetch } = useQuery( GET_CART, {
		notifyOnNetworkStatusChange: true,
		onCompleted: () => {
			// console.warn( 'completed GET_CART', data );
			// Update cart in the localStorage.
			const updatedCart = getFormattedCart( data );
			console.warn( 'updatedCArt', updatedCart );
			localStorage.setItem( 'woo-next-cart', JSON.stringify( updatedCart ) );

			// Update cart data in React Context.
			setCart( updatedCart );
		}
	} );

	// Update Cart Mutation.
	const [updateCart, { data: updateCartResponse, loading: updateCartProcessing, error: updateCartError }] = useMutation( UPDATE_CART, {
		onCompleted: () => {
			refetch();
		},
		onError: ( error ) => {
			if ( error ) {
				setRequestError( error.graphQLErrors[ 0 ].message );
			}
		}
	} );

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

	// if ( loading ) {
	// 	return <p>Loading...</p>;
	// }

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
									updateCartProcessing={ updateCartProcessing }
									products={ cart.products }
									setProcessing={ setProcessing }
									handleRemoveProductClick={ handleRemoveProductClick }
									updateCart={ updateCart }
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
