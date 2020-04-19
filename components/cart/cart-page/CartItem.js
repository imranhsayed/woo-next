import { useState } from 'react';
import { updateCart } from "../../../functions";

const CartItem = ( { item, handleRemoveProductClick, setCart } ) => {

	const [ productCount, setProductCount ] = useState( item.qty );

	console.warn( 'item', item );
	/*
	 * When user changes the qty from product input update the cart in localStorage
	 * Also update the cart in global context
	 *
	 * @param {Object} event event
	 *
	 * @return {void}
	 */
	const handleQtyChange = ( event ) => {

		if ( process.browser ) {

			const newQty = event.target.value;

			// Set the new qty in State
			setProductCount( newQty );

			let existingCart = localStorage.getItem( 'woo-next-cart' );
			existingCart = JSON.parse( existingCart );

			// Update the cart in localStorage.
			const updatedCart = updateCart( existingCart, item, false, newQty );

			// Update the cart in global context
			setCart( updatedCart );

		}
	};

	return (
		<tr className="woo-next-cart-item" key={item.productId}>
			<th className="woo-next-cart-element woo-next-cart-el-close">
				{/* @TODO Need to update this with graphQL query */}
				{/*<span className="woo-next-cart-close-icon" onClick={ ( event ) => handleRemoveProductClick( event, item.productId )  }>*/}
				{/*	<i className="fa fa-times-circle"/>*/}
				{/*</span>*/}
			</th>
			<td className="woo-next-cart-element">
				<img width="64" src={ item.image.sourceUrl } srcSet={ item.image.srcSet } alt={item.image.title}/>
			</td>
			<td className="woo-next-cart-element">{ item.name }</td>
			<td className="woo-next-cart-element">{ ( 'string' !== typeof item.price ) ? item.price.toFixed(2) : item.price }</td>

			{/* Qty Input */}
			<td className="woo-next-cart-element">
				<span className="text-center">{ productCount }</span>
				{/* @TODO Need to update this with graphQL query */}
				{/*<input*/}
				{/*	type="number"*/}
				{/*	min="1"*/}
				{/*	className="woo-next-cart-qty-input"*/}
				{/*	value={ productCount }*/}
				{/*	onChange={ handleQtyChange }*/}
				{/*/>*/}
			</td>
			<td className="woo-next-cart-element">{ ( 'string' !== typeof item.totalPrice ) ? item.totalPrice.toFixed(2) : item.totalPrice }</td>
		</tr>
	)
};

export default CartItem;
