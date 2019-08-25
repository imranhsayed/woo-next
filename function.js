export const getFloatVal = ( string ) => {

	let floatValue = string.match( /[+-]?\d+(\.\d+)?/g )[0];
	return ( null !== floatValue ) ? parseFloat( parseFloat( floatValue ).toFixed( 2 ) ) : '';
};

export const addFirstProduct = ( product ) => {

	let productPrice = getFloatVal( product.price );

	// Create an empty array and push the item.
	let newCart = {
		products: [],
		totalProductsCount: 1,
		totalProductsPrice: parseFloat( productPrice.toFixed( 2 ) )
	};

	const newProduct = createNewProduct( product, productPrice, 1 );
	newCart.products.push( newProduct );

	localStorage.setItem( 'woo-next-cart', JSON.stringify( newCart ) );
	return newCart;

};

/**
 * Create a new product object.
 *
 * @param product
 * @param productPrice
 * @param qty
 * @return {{image: *, productId: *, totalPrice: *, price: *, qty: *, name: *}}
 */
export const createNewProduct = ( product, productPrice, qty ) => {
	return {
		productId: product.productId,
		image: product.image,
		name: product.name,
		price: productPrice,
		qty: qty,
		totalPrice: parseFloat( ( productPrice * qty ).toFixed( 2 ) )
	}
};

export const updateCart = ( existingCart, product, qtyToBeAdded, newQty = false ) => {

	const updatedProducts = getUpdatedProducts( existingCart.products, product, qtyToBeAdded, newQty );
	console.warn( 'upda', updatedProducts );
	const addPrice = ( total, item ) => {
		total.totalPrice += item.totalPrice;
		total.qty += item.qty;

		return total;
	};

	// Loop through the updated product array and add the totalPrice of each item to get the totalPrice.
	let total = updatedProducts.reduce( addPrice, { totalPrice: 0, qty: 0 } );


	const updatedCart = {
		products: updatedProducts,
		totalProductsCount: parseInt( total.qty  ),
		totalProductsPrice: parseFloat( total.totalPrice )
	};

	localStorage.setItem( 'woo-next-cart', JSON.stringify( updatedCart ) );

	return updatedCart;

};

/**
 * Get updated products array.
 * Updated the product if its exits
 * and add the new product to existing cart.
 *
 *
 * @param existingProductsInCart
 * @param product
 * @param qtyToBeAdded
 * @param newQty
 * @return {*}
 */
export const getUpdatedProducts = ( existingProductsInCart, product, qtyToBeAdded, newQty = false ) => {

	const productExistsIndex = isProductInCart( existingProductsInCart, product.productId );

	// If product exists ( index of that product is found in the array ) , update the product quantity and totalPrice
	if ( -1 < productExistsIndex ) {
		let updatedProducts = existingProductsInCart;
		let updatedProduct = updatedProducts[ productExistsIndex ];

		// If we have the new qty of the product available, set that else add the qtyTobeadded.
		updatedProduct.qty = ( newQty ) ? parseInt( newQty ) : parseInt( updatedProduct.qty + qtyToBeAdded );
		updatedProduct.totalPrice = parseFloat( parseFloat( updatedProduct.price * updatedProduct.qty ).toFixed( 2 ) );

		return updatedProduct;
	} else {
		// If product not found push the new product to the existing products array.
		let productPrice = getFloatVal( product.price );
		const newProduct = createNewProduct( product, productPrice, qtyToBeAdded );
		existingProductsInCart.push( newProduct );
		return existingProductsInCart;
	}

};

/**
 * return index of the product if it exits
 *
 * @param existingProductsInCart
 * @param productId
 * @return {number | *}
 */
export const isProductInCart = ( existingProductsInCart, productId ) => {

	const returnItemThatExits = ( item, index ) => {
		if (  productId === item.productId ) {
			return item;
		}
	};

	const newArray = existingProductsInCart.filter( returnItemThatExits );

	return existingProductsInCart.indexOf( newArray[0] );

};
