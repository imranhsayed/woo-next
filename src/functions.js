import { v4 } from 'uuid';
import {isEmpty, isArray} from 'lodash'

/**
 * Named HTML entities WooCommerce uses in its formatted price strings.
 *
 * Currency symbols are commonly emitted as entities (e.g. `&#036;`), and the
 * gap between amount and symbol is a `&nbsp;`.
 */
const NAMED_ENTITIES = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
	nbsp: '\u00a0',
	euro: '\u20ac',
	pound: '\u00a3',
	yen: '\u00a5',
	cent: '\u00a2',
	ndash: '\u2013',
	mdash: '\u2014',
};

/**
 * Decode HTML entities in a string.
 *
 * WooCommerce returns prices as HTML (`15,00&nbsp;\u20ac`), but React escapes
 * text nodes, so the raw entity would be shown to the user. Decoding here keeps
 * the value a plain string, so we never need `dangerouslySetInnerHTML`.
 *
 * Implemented without the DOM so it behaves identically during SSR.
 *
 * @param {string} value Possibly entity-encoded string.
 * @return {string} Decoded string, or the input unchanged if not a string.
 */
export const decodeHtmlEntities = ( value ) => {

	if ( 'string' !== typeof value ) {
		return value;
	}

	return value.replace( /&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]*);/gi, ( match, entity ) => {

		if ( '#' === entity[ 0 ] ) {
			const isHex = 'x' === entity[ 1 ].toLowerCase();
			const codePoint = parseInt( entity.slice( isHex ? 2 : 1 ), isHex ? 16 : 10 );

			try {
				return String.fromCodePoint( codePoint );
			} catch ( error ) {
				// Out-of-range code point; leave the original text untouched.
				return match;
			}
		}

		const named = NAMED_ENTITIES[ entity.toLowerCase() ];

		return undefined !== named ? named : match;
	} );
};

/**
 * Parse the first number out of a formatted price string.
 *
 * Handles both separator conventions, since the currency symbol may lead
 * (`$1,234.56`) or trail (`1.234,56\u00a0\u20ac`), and picks the first amount
 * from a range such as `15,00\u20ac - 20,00\u20ac`.
 *
 * @param {string|number} value Formatted price.
 * @return {number} Parsed amount, or NaN when there is no number to read.
 */
export const parsePriceNumber = ( value ) => {

	if ( 'number' === typeof value ) {
		return value;
	}

	if ( 'string' !== typeof value ) {
		return NaN;
	}

	const match = decodeHtmlEntities( value ).match( /-?\d[\d.,\s\u00a0]*/ );

	if ( ! match ) {
		return NaN;
	}

	// Drop grouping spaces, e.g. the French "1 234,56".
	let digits = match[ 0 ].replace( /[\s\u00a0]/g, '' ).replace( /[.,]$/, '' );

	const lastDot = digits.lastIndexOf( '.' );
	const lastComma = digits.lastIndexOf( ',' );
	const lastSeparator = Math.max( lastDot, lastComma );

	if ( -1 !== lastSeparator ) {
		/**
		 * When both separators appear, the right-most one is the decimal mark.
		 * With only one, three trailing digits mean thousands grouping
		 * (`1,234`), anything else means a decimal mark (`15,00`).
		 */
		const hasBoth = -1 !== lastDot && -1 !== lastComma;
		const trailingDigits = digits.length - lastSeparator - 1;
		const isDecimalMark = hasBoth || 3 !== trailingDigits;

		if ( isDecimalMark ) {
			// Strip grouping marks, then normalise the decimal mark to a dot.
			const grouping = '.' === digits[ lastSeparator ] ? ',' : '.';
			digits = digits.split( grouping ).join( '' );
			digits = digits.replace( /[.,]([^.,]*)$/, '.$1' );
		} else {
			digits = digits.split( digits[ lastSeparator ] ).join( '' );
		}
	}

	const amount = parseFloat( digits );

	return Number.isNaN( amount ) ? NaN : amount;
};

/**
 * Extracts and returns float value from a string.
 *
 * @param {string} string String
 * @return {any}
 */
export const getFloatVal = ( string ) => {

	let floatValue = string.match( /[+-]?\d+(\.\d+)?/g )[0];
	return ( null !== floatValue ) ? parseFloat( parseFloat( floatValue ).toFixed( 2 ) ) : '';

};

/**
 * Add first product.
 *
 * @param {Object} product Product
 * @return {{totalProductsCount: number, totalProductsPrice: any, products: Array}}
 */
export const addFirstProduct = ( product ) => {

	let productPrice = getFloatVal( product.price );

	let newCart = {
		products: [],
		totalProductsCount: 1,
		totalProductsPrice: productPrice
	};

	const newProduct = createNewProduct( product, productPrice, 1 );
	newCart.products.push( newProduct );

	localStorage.setItem( 'woo-next-cart', JSON.stringify( newCart ) );

	return newCart;
};

/**
 * Create a new product object.
 *
 * @param {Object} product Product
 * @param {Integer} productPrice Product Price
 * @param {Integer} qty Quantity
 * @return {{image: *, productId: *, totalPrice: number, price: *, qty: *, name: *}}
 */
export const createNewProduct = ( product, productPrice, qty ) => {

	return  {
		productId: product.productId,
		image: product.image,
		name: product.name,
		price: productPrice,
		qty,
		totalPrice: parseFloat( ( productPrice * qty ).toFixed( 2 ) )
	};

};

/**
 * Updates the existing cart with new item.
 *
 * @param {Object} existingCart Existing Cart.
 * @param {Object} product Product.
 * @param {Integer} qtyToBeAdded Quantity.
 * @param {Integer} newQty New Qty to be updated.
 * @return {{totalProductsCount: *, totalProductsPrice: *, products: *}}
 */
export const updateCart = ( existingCart, product, qtyToBeAdded, newQty = false  ) => {

	const updatedProducts = getUpdatedProducts( existingCart.products , product, qtyToBeAdded, newQty );

	const addPrice = (total, item) => {
		total.totalPrice += item.totalPrice;
		total.qty += item.qty;

		return total;
	};

	// Loop through the updated product array and add the totalPrice of each item to get the totalPrice
	let total = updatedProducts.reduce( addPrice, { totalPrice: 0, qty: 0 } );

	const updatedCart = {
		products: updatedProducts,
		totalProductsCount: parseInt( total.qty ),
		totalProductsPrice: parseFloat( total.totalPrice )
	};

	localStorage.setItem( 'woo-next-cart', JSON.stringify( updatedCart ) );

	return updatedCart;
};

/**
 * Get updated products array
 * Update the product if it exists else,
 * add the new product to existing cart,
 *
 * @param {Object} existingProductsInCart Existing product in cart
 * @param {Object} product Product
 * @param {Integer} qtyToBeAdded Quantity
 * @param {Integer} newQty New qty of the product (optional)
 * @return {*[]}
 */
export const getUpdatedProducts = ( existingProductsInCart, product, qtyToBeAdded, newQty = false ) => {

	// Check if the product already exits in the cart.
	const productExitsIndex = isProductInCart( existingProductsInCart, product.productId );

	// If product exits ( index of that product found in the array ), update the product quantity and totalPrice
	if ( -1 < productExitsIndex ) {
		let updatedProducts = existingProductsInCart;
		let updatedProduct = updatedProducts[ productExitsIndex ];

		// If have new qty of the product available, set that else add the qtyToBeAdded
		updatedProduct.qty = ( newQty ) ? parseInt( newQty ) : parseInt( updatedProduct.qty + qtyToBeAdded );
		updatedProduct.totalPrice = parseFloat( ( updatedProduct.price * updatedProduct.qty ).toFixed( 2 ) );

		return  updatedProducts;
	} else {

		// If product not found push the new product to the existing product array.
		let productPrice = getFloatVal( product.price );
		const newProduct = createNewProduct( product, productPrice, qtyToBeAdded );
		existingProductsInCart.push( newProduct );

		return existingProductsInCart;
	}
};

/**
 * Returns index of the product if it exists.
 *
 * @param {Object} existingProductsInCart Existing Products.
 * @param {Integer} productId Product id.
 * @return {number | *} Index Returns -1 if product does not exist in the array, index number otherwise
 */
const isProductInCart = ( existingProductsInCart, productId ) => {

	const returnItemThatExits = ( item, index ) => {
		if ( productId === item.productId ) {
			return item;
		}
	};

	// This new array will only contain the product which is matched.
	const newArray = existingProductsInCart.filter( returnItemThatExits );

	return existingProductsInCart.indexOf( newArray[0] );
};

/**
 * Remove Item from the cart.
 *
 * @param {Integer} productId Product Id.
 * @return {any | string} Updated cart
 */
export const removeItemFromCart = ( productId ) => {

	let existingCart = localStorage.getItem( 'woo-next-cart' );
	existingCart = JSON.parse( existingCart );

	// If there is only one item in the cart, delete the cart.
	if ( 1 === existingCart.products.length ) {

		localStorage.removeItem( 'woo-next-cart' );
		return null;

	}

	// Check if the product already exits in the cart.
	const productExitsIndex = isProductInCart( existingCart.products, productId );

	// If product to be removed exits
	if ( -1 < productExitsIndex ) {

		const productTobeRemoved = existingCart.products[ productExitsIndex ];
		const qtyToBeRemovedFromTotal = productTobeRemoved.qty;
		const priceToBeDeductedFromTotal = productTobeRemoved.totalPrice;

		// Remove that product from the array and update the total price and total quantity of the cart
		let updatedCart = existingCart;
		updatedCart.products.splice( productExitsIndex, 1 );
		updatedCart.totalProductsCount = updatedCart.totalProductsCount - qtyToBeRemovedFromTotal;
		updatedCart.totalProductsPrice = updatedCart.totalProductsPrice - priceToBeDeductedFromTotal;

		localStorage.setItem( 'woo-next-cart', JSON.stringify( updatedCart ) );
		return updatedCart;

	} else {
		return existingCart;
	}
};

/**
 * Returns cart data in the required format.
 * @param {String} data Cart data
 */
export const getFormattedCart = ( data ) => {

	let formattedCart = null;

	if ( undefined === data || ! data.cart.contents.nodes.length ) {
		return formattedCart;
	}

	const givenProducts = data.cart.contents.nodes;

	// Create an empty object.
	formattedCart = {};
	formattedCart.products = [];
	let totalProductsCount = 0;

	for( let i = 0; i < givenProducts.length; i++  ) {
		const givenProduct = givenProducts?.[ i ]?.product?.node;
		const product = {};
		const total = getFloatVal( givenProducts[ i ].total );

		product.productId = givenProduct?.productId ?? '';
		product.cartKey = givenProducts?.[ i ]?.key ?? '';
		product.name = givenProduct?.name ?? '';
		product.qty = givenProducts?.[ i ]?.quantity;
		product.price = total / product?.qty;
		product.totalPrice = decodeHtmlEntities( givenProducts?.[ i ]?.total ?? '' );
		product.image = {
			sourceUrl: givenProduct?.image?.sourceUrl ?? '',
			srcSet: givenProduct?.image?.srcSet ?? '',
			title: givenProduct?.image?.title ?? '',
			altText: givenProduct?.image?.altText ?? ''
		};

		totalProductsCount += givenProducts?.[ i ]?.quantity;

		// Push each item into the products array.
		formattedCart.products.push( product );
	}

	formattedCart.totalProductsCount = totalProductsCount;
	formattedCart.totalProductsPrice = decodeHtmlEntities( data?.cart?.total ?? '' );

	return formattedCart;

};

export const createCheckoutData = ( order ) => {

	// Set the billing Data to shipping, if applicable.
	const billingData = order.billingDifferentThanShipping ? order.billing : order.shipping;

	const checkoutData = {
		clientMutationId: v4(),
		shipping: {
			firstName: order?.shipping?.firstName,
			lastName: order?.shipping?.lastName,
			address1: order?.shipping?.address1,
			address2: order?.shipping?.address2,
			city: order?.shipping?.city,
			country: order?.shipping?.country,
			state: order?.shipping?.state,
			postcode: order?.shipping?.postcode,
			email: order?.shipping?.email,
			phone: order?.shipping?.phone,
			company: order?.shipping?.company,
		},
		billing: {
			firstName: billingData?.firstName,
			lastName: billingData?.lastName,
			address1: billingData?.address1,
			address2: billingData?.address2,
			city: billingData?.city,
			country: billingData?.country,
			state: billingData?.state,
			postcode: billingData?.postcode,
			email: billingData?.email,
			phone: billingData?.phone,
			company: billingData?.company,
		},
		shipToDifferentAddress: order.billingDifferentThanShipping,
		paymentMethod: order.paymentMethod,
		isPaid: false,
	};

	if (order.createAccount) {
		checkoutData.account = {
			username: order.username,
			password: order.password,
		};
	}

	return checkoutData;
};

/**
 * Get the updated items in the below format required for mutation input.
 *
 * [
 * { "key": "33e75ff09dd601bbe6dd51039152189", "quantity": 1 },
 * { "key": "02e74f10e0327ad868d38f2b4fdd6f0", "quantity": 1 },
 * ]
 *
 * Creates an array in above format with the newQty (updated Qty ).
 *
 */
export const getUpdatedItems = ( products, newQty, cartKey ) => {

	// Create an empty array.
	const updatedItems = [];

	// Loop through the product array.
	products.map( ( cartItem ) => {

		// If you find the cart key of the product user is trying to update, push the key and new qty.
		if ( cartItem.cartKey === cartKey ) {

			updatedItems.push( {
				key: cartItem.cartKey,
				quantity: parseInt( newQty )
			} );

			// Otherwise just push the existing qty without updating.
		} else {
			updatedItems.push( {
				key: cartItem.cartKey,
				quantity: cartItem.qty
			} );
		}
	} );

	// Return the updatedItems array with new Qtys.
	return updatedItems;

};
