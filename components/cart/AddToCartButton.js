import { useState, useContext } from 'react';
import { AppContext } from "../context/AppContext";
import { addFirstProduct, updateCart } from "../../functions";
import Link from 'next/link';

const AddToCartButton = ( props ) => {

	const { product } = props;
	const [ cart, setCart ] = useContext( AppContext );
	const [ showViewCart, setShowViewCart ] = useState( false );

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

	return(
		<React.Fragment>
			<button onClick={ handleAddToCartClick } className="btn btn-secondary">Add to cart</button>
			{ showViewCart ? (
				<Link href="/cart"><button className="woo-next-view-cart-btn btn btn-secondary">View Cart</button></Link>
			) : '' }

		</React.Fragment>
	)
};

export default AddToCartButton;
