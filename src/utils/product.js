import { decodeHtmlEntities, parsePriceNumber } from '../functions';
import { getSwatch, sortSizes } from '../constants/swatches';
import { discountPercent } from './media';
import { productHref } from '../constants/nav';

/** Categories that describe a product's state rather than its department. */
const DERIVED_CATEGORIES = [ 'new', 'offers', 'uncategorized' ];

/**
 * Normalise a GraphQL product node for display.
 *
 * Flattens the pieces every card, tile and buy box needs: the two images,
 * the subcategory label, badge state, formatted prices, colour swatches and
 * size count.
 *
 * @param {Object} node Product node selected with `PRODUCT_CARD_FIELDS`.
 *
 * @return {Object|null} Display-ready product, or null without a node.
 */
export const normaliseProduct = ( node ) => {

	if ( ! node ) {
		return null;
	}

	const categories = node.productCategories?.nodes ?? [];
	const attributes = node.attributes?.nodes ?? [];

	const colorOptions = attributes.find( ( attribute ) => 'pa_color' === attribute.name )?.options ?? [];
	const sizeOptions = attributes.find( ( attribute ) => 'pa_size' === attribute.name )?.options ?? [];

	const price = parsePriceNumber( node.price );
	const regular = parsePriceNumber( node.regularPrice );

	const stockQuantity = node.stockQuantity ?? null;
	const lowStockAmount = node.lowStockAmount ?? null;

	return {
		id: node.id,
		databaseId: node.databaseId,
		name: node.name,
		slug: node.slug,
		href: productHref( node.slug ),
		type: node.type,

		date: node.date ?? '',

		image: node.image?.sourceUrl ?? '',
		hoverImage: node.galleryImages?.nodes?.[ 0 ]?.sourceUrl ?? '',

		categories,

		// The subcategory is the one with a parent; the rest are the top-level
		// category and the derived New / Offers landing categories.
		subCategory: categories.find( ( category ) => category.parentDatabaseId )?.name ?? '',
		subCategorySlug: categories.find( ( category ) => category.parentDatabaseId )?.slug ?? '',
		department: categories.find( ( category ) =>
			! category.parentDatabaseId && ! DERIVED_CATEGORIES.includes( category.slug )
		)?.name ?? '',
		departmentSlug: categories.find( ( category ) =>
			! category.parentDatabaseId && ! DERIVED_CATEGORIES.includes( category.slug )
		)?.slug ?? '',
		isNew: categories.some( ( category ) => 'new' === category.slug ),

		onSale: !! node.onSale,
		priceLabel: decodeHtmlEntities( node.price ?? '' ),
		regularPriceLabel: decodeHtmlEntities( node.regularPrice ?? '' ),
		price,
		discount: node.onSale ? discountPercent( price, regular ) : 0,

		isSoldOut: 'OUT_OF_STOCK' === node.stockStatus,
		// WooCommerce only reports a quantity when the product manages stock.
		isLowStock: null !== stockQuantity && stockQuantity > 0 && stockQuantity <= ( lowStockAmount ?? 0 ),
		stockQuantity,

		isDownloadable: !! node.downloadable,
		externalUrl: node.externalUrl ?? '',

		colors: colorOptions.map( ( slug ) => ( { slug, ...getSwatch( slug ) } ) ),
		sizes: sortSizes( sizeOptions ),

		rating: node.averageRating ?? 0,
		reviewCount: node.reviewCount ?? 0,
	};
};

/**
 * Normalise a list of product nodes, dropping anything empty.
 *
 * @param {Array} nodes Product nodes.
 *
 * @return {Array} Display-ready products.
 */
export const normaliseProducts = ( nodes = [] ) => nodes.map( normaliseProduct ).filter( Boolean );

/**
 * Tag each product with the category the filter sidebar groups it under.
 *
 * On /shop and in search results that is the product's department — its
 * top-level category. Inside a category that has children it is the matching
 * child, so the sidebar offers types ("Jackets", "Tailoring") instead of
 * repeating the department.
 *
 * @param {Array}       products         Display-ready products.
 * @param {number|null} parentDatabaseId Term ID to group children of, or null
 *                                       to group by top-level category.
 *
 * @return {Array} Products with a `groupSlug`.
 */
export const withGroupSlug = ( products, parentDatabaseId = null ) => products.map( ( product ) => {

	const group = parentDatabaseId
		? product.categories.find( ( category ) => category.parentDatabaseId === parentDatabaseId )
		: product.categories.find( ( category ) =>
			! category.parentDatabaseId && ! DERIVED_CATEGORIES.includes( category.slug )
		);

	return { ...product, groupSlug: group?.slug ?? '' };
} );

/**
 * Order products to match a list of slugs.
 *
 * GraphQL ignores the order of a `slugIn` filter, but the editorial sections
 * care which product sits in which slot.
 *
 * @param {Array} products Display-ready products.
 * @param {Array} slugs    Slugs in the intended order.
 *
 * @return {Array} Products in slug order, omitting any that are missing.
 */
export const orderBySlugs = ( products, slugs ) => slugs
	.map( ( slug ) => products.find( ( product ) => product.slug === slug ) )
	.filter( Boolean );
