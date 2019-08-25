import { useState, useContext } from 'react';
import { AppContext } from "../context/AppContext";
import { addFirstProduct, updateCart } from "../../function";

import Link from 'next/link';

const AddToCartButton = ( props ) => {

	const { product } = props;
	const [ cart, setCart ] = useContext( AppContext );

	const handleAddToCartClick = () => {

		if ( process.browser ) {

			let existingCart = localStorage.getItem( 'woo-next-cart' );

			// If cart has item(s) already, then update the exiting
			if ( existingCart ) {

				existingCart = JSON.parse( existingCart );

				const qtyToBeAdded = 1;

				const updatedCart = updateCart( existingCart, product, qtyToBeAdded );
				setCart( updatedCart );

			} else {
				/**
				 * Add first product.
				 */
				const newCart = addFirstProduct( product );
				setCart( newCart );
			}

		}
	};

	return (
		<React.Fragment>
			<button onClick={ handleAddToCartClick } className="btn btn-secondary">Add to cart</button>
		</React.Fragment>
	)
};

export default AddToCartButton;
