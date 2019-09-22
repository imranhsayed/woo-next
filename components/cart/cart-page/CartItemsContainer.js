import Link from 'next/link';
import { useContext } from 'react';
import { AppContext } from "../../context/AppContext";
import { removeItemFromCart } from '../../../functions';
import CartItem from "./CartItem";

const CartItemsContainer = () => {


	const [ cart, setCart ] = useContext( AppContext );

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
									<td className="woo-next-cart-element-amt">{ cart.totalProductsPrice.toFixed( 2 ) }</td>
								</tr>
								<tr className="table-light">
									<td className="woo-next-cart-element-total">Total</td>
									<td className="woo-next-cart-element-amt">{ cart.totalProductsPrice.toFixed( 2 ) }</td>
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
