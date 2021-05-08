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
