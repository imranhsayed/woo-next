import { decodeHtmlEntities, parsePriceNumber } from '../functions';

/**
 * Format an amount the way the store does.
 *
 * Mirrors WooCommerce's EUR formatting — comma decimal mark, trailing symbol
 * after a non-breaking space — for the few figures the browser derives itself
 * rather than receiving pre-formatted.
 *
 * @param {number} amount Amount.
 *
 * @return {string} Formatted price.
 */
export const formatPrice = ( amount ) => `${ ( Math.round( ( amount || 0 ) * 100 ) / 100 )
	.toFixed( 2 )
	.replace( '.', ',' ) } €`;

/**
 * Add a net figure to its tax so the customer-facing amount comes out.
 *
 * Catalog prices include VAT, but WooCommerce reports cart figures net with the
 * tax alongside. Every total shown to a shopper is therefore the sum of the
 * two, otherwise an 18,00 € beanie reads as 14,88 €.
 *
 * @param {string} net Formatted net amount.
 * @param {string} tax Formatted tax amount.
 *
 * @return {number} Gross amount.
 */
export const grossValue = ( net, tax ) => {

	const netValue = parsePriceNumber( net );
	const taxValue = parsePriceNumber( tax );

	return ( Number.isNaN( netValue ) ? 0 : netValue ) + ( Number.isNaN( taxValue ) ? 0 : taxValue );
};

/**
 * Gross amount, formatted.
 *
 * @param {string} net Formatted net amount.
 * @param {string} tax Formatted tax amount.
 *
 * @return {string} Formatted gross amount.
 */
export const grossPrice = ( net, tax ) => formatPrice( grossValue( net, tax ) );

/**
 * Turn a WooCommerce notice into plain text.
 *
 * Cart and coupon errors arrive as HTML — a minimum-spend message embeds a
 * formatted price in `<span>` markup — so tags are stripped and entities
 * decoded before the string reaches the page.
 *
 * @param {string} message Possibly HTML message.
 *
 * @return {string} Plain text.
 */
export const toPlainMessage = ( message ) => decodeHtmlEntities(
	decodeHtmlEntities( message ?? '' ).replace( /<[^>]*>/g, '' )
)
	.replace( /\s+/g, ' ' )
	.trim();
