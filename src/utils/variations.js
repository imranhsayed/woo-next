import { parsePriceNumber, decodeHtmlEntities } from '../functions';
import { getSwatch, sortSizes } from '../constants/swatches';

/**
 * Normalise one WooCommerce variation.
 *
 * Attribute values arrive as term slugs keyed by taxonomy (`pa_size`), so they
 * are flattened to a plain `{ size, color }` selection shape.
 *
 * @param {Object} node Variation node.
 *
 * @return {Object} Normalised variation.
 */
const normaliseVariation = ( node ) => {

	const attributes = {};

	( node.attributes?.nodes ?? [] ).forEach( ( attribute ) => {
		attributes[ ( attribute.name ?? '' ).replace( /^pa_/, '' ) ] = attribute.value ?? '';
	} );

	return {
		databaseId: node.databaseId,
		attributes,
		price: parsePriceNumber( node.price ),
		priceLabel: decodeHtmlEntities( node.price ?? '' ),
		regularPriceLabel: decodeHtmlEntities( node.regularPrice ?? '' ),
		onSale: !! node.onSale,
		isInStock: 'OUT_OF_STOCK' !== node.stockStatus,
		stockQuantity: node.stockQuantity ?? null,
	};
};

/**
 * Build the variation matrix for a variable product.
 *
 * WooCommerce holds one variation per size/colour pair, each with its own price
 * and stock status, so availability is read from the variations themselves
 * rather than from a separate list of exclusions.
 *
 * @param {Object} product    Normalised parent product.
 * @param {Array}  variations Variation nodes from GraphQL.
 *
 * @return {Object} `variations`, the ordered `sizes` and `colors`, and the
 *                  attribute names that actually vary.
 */
export const buildVariationMatrix = ( product, variations = [] ) => {

	const normalised = variations.map( normaliseVariation );

	const sizeSet = new Set();
	const colorSet = new Set();

	normalised.forEach( ( variation ) => {

		if ( variation.attributes.size ) {
			sizeSet.add( variation.attributes.size );
		}

		if ( variation.attributes.color ) {
			colorSet.add( variation.attributes.color );
		}
	} );

	return {
		variations: normalised,
		// Parent attribute order is alphabetical over GraphQL, so re-sort sizes.
		sizes: sortSizes( [ ...sizeSet ] ),
		colors: [ ...colorSet ].map( ( slug ) => ( { slug, ...getSwatch( slug ) } ) ),
		varies: {
			size: sizeSet.size > 0,
			// A single colour is not a choice; it is auto-selected and hidden.
			color: colorSet.size > 1,
		},
		singleColor: 1 === colorSet.size ? [ ...colorSet ][ 0 ] : '',
	};
};

/**
 * Find the variation matching a selection.
 *
 * Every attribute the variation defines must be chosen, otherwise the
 * selection is still incomplete and no variation can be resolved.
 *
 * @param {Array}  variations Normalised variations.
 * @param {Object} selection  Chosen `{ size, color }`.
 *
 * @return {Object|null} The matching variation, or null.
 */
export const findVariation = ( variations, selection ) => variations.find( ( variation ) =>
	Object.entries( variation.attributes ).every( ( [ name, value ] ) => selection[ name ] === value )
) ?? null;

/**
 * Whether a size can be ordered.
 *
 * With a colour chosen, only that pair matters. Without one, the size is
 * available while any colour of it is in stock.
 *
 * @param {Array}  variations    Normalised variations.
 * @param {string} size          Size slug.
 * @param {string} selectedColor Chosen colour slug, if any.
 *
 * @return {boolean} Whether the size is orderable.
 */
export const isSizeAvailable = ( variations, size, selectedColor ) => variations.some( ( variation ) => {

	if ( variation.attributes.size !== size ) {
		return false;
	}

	if ( selectedColor && variation.attributes.color && variation.attributes.color !== selectedColor ) {
		return false;
	}

	return variation.isInStock;
} );

/**
 * Whether a colour can be ordered.
 *
 * @param {Array}  variations   Normalised variations.
 * @param {string} color        Colour slug.
 * @param {string} selectedSize Chosen size slug, if any.
 *
 * @return {boolean} Whether the colour is orderable.
 */
export const isColorAvailable = ( variations, color, selectedSize ) => variations.some( ( variation ) => {

	if ( variation.attributes.color !== color ) {
		return false;
	}

	if ( selectedSize && variation.attributes.size && variation.attributes.size !== selectedSize ) {
		return false;
	}

	return variation.isInStock;
} );
