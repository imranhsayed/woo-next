import { useMemo, useState } from 'react';

import { PRICE_BANDS, PRODUCTS_PER_PAGE } from '../constants/categories';
import { sortSizes } from '../constants/swatches';

/** A filter set with nothing applied. */
export const emptyFilters = () => ( {
	groups: [],   // Category or subcategory slugs, depending on the view.
	sizes: [],
	colors: [],
	price: '',
	inStock: false,
	sort: 'relevance',
} );

/**
 * Catalog filtering, sorting and pagination.
 *
 * The whole product set for a view arrives with the page, so filtering runs in
 * the browser. That keeps facet counts exact and makes numbered pagination
 * straightforward — both of which the design relies on.
 *
 * @param {Array}  products        Display-ready products for this view.
 * @param {Object} options         `groupBy` ('category'|'subcategory'),
 *                                 `groups` (facet definitions),
 *                                 `popularityOrder` (slugs, most popular first),
 *                                 `initialGroups` (pre-applied group slugs).
 *
 * @return {Object} Filter state, derived facets and the current page of results.
 */
const useCatalogFilters = ( products, options = {} ) => {

	const { groups = [], popularityOrder = [], initialGroups = [] } = options;

	const [ filters, setFilters ] = useState( () => ( { ...emptyFilters(), groups: initialGroups } ) );
	const [ page, setPage ] = useState( 1 );

	/** Rank lookup for the "Most popular" sort. */
	const popularityRank = useMemo( () => {

		const ranks = new Map();

		popularityOrder.forEach( ( slug, index ) => ranks.set( slug, index ) );

		return ranks;
	}, [ popularityOrder ] );

	/**
	 * Apply a filter change.
	 *
	 * Any change but the sort returns to page one, since the current page may
	 * no longer exist.
	 *
	 * @param {Object}  patch     Filter fields to change.
	 * @param {boolean} keepPage  Keep the current page.
	 */
	const update = ( patch, keepPage = false ) => {

		setFilters( ( current ) => ( { ...current, ...patch } ) );

		if ( ! keepPage ) {
			setPage( 1 );
		}
	};

	/**
	 * Add or remove one value from a multi-select filter.
	 *
	 * @param {string} key   Filter key.
	 * @param {string} value Value to toggle.
	 */
	const toggle = ( key, value ) => setFilters( ( current ) => {

		const list = current[ key ];

		setPage( 1 );

		return {
			...current,
			[ key ]: list.includes( value ) ? list.filter( ( item ) => item !== value ) : [ ...list, value ],
		};
	} );

	/** Reset every filter, keeping the chosen sort. */
	const clearAll = () => {

		setFilters( ( current ) => ( { ...emptyFilters(), sort: current.sort } ) );
		setPage( 1 );
	};

	/** Products matching the active filters, before sorting. */
	const matched = useMemo( () => {

		const band = PRICE_BANDS.find( ( item ) => item.id === filters.price );

		return products.filter( ( product ) => {

			if ( filters.groups.length && ! filters.groups.includes( product.groupSlug ) ) {
				return false;
			}

			// A size counts only while it is actually orderable.
			if ( filters.sizes.length && ! product.sizes.some( ( size ) => filters.sizes.includes( size ) ) ) {
				return false;
			}

			if ( filters.colors.length && ! product.colors.some( ( color ) => filters.colors.includes( color.slug ) ) ) {
				return false;
			}

			if ( filters.inStock && product.isSoldOut ) {
				return false;
			}

			if ( band ) {
				if ( product.price < band.min ) {
					return false;
				}

				if ( null !== band.max && product.price >= band.max ) {
					return false;
				}
			}

			return true;
		} );
	}, [ products, filters ] );

	/** Matched products in the chosen order. */
	const sorted = useMemo( () => {

		const list = [ ...matched ];

		switch ( filters.sort ) {
			case 'newest':
				return list.sort( ( a, b ) => new Date( b.date ) - new Date( a.date ) );
			case 'popular':
				return list.sort( ( a, b ) =>
					( popularityRank.get( a.slug ) ?? Infinity ) - ( popularityRank.get( b.slug ) ?? Infinity )
				);
			case 'price-asc':
				return list.sort( ( a, b ) => a.price - b.price );
			case 'price-desc':
				return list.sort( ( a, b ) => b.price - a.price );
			default:
				// "Relevance" keeps whatever order the server returned.
				return list;
		}
	}, [ matched, filters.sort, popularityRank ] );

	const totalPages = Math.max( 1, Math.ceil( sorted.length / PRODUCTS_PER_PAGE ) );
	const currentPage = Math.min( page, totalPages );
	const pageStart = ( currentPage - 1 ) * PRODUCTS_PER_PAGE;

	/**
	 * Facet options with their counts.
	 *
	 * Counts come from the unfiltered set so the numbers stay stable as
	 * filters are toggled, and options that match nothing are dropped.
	 */
	const facets = useMemo( () => {

		const groupOptions = groups
			.map( ( group ) => ( {
				...group,
				count: products.filter( ( product ) => product.groupSlug === group.slug ).length,
				isActive: filters.groups.includes( group.slug ),
			} ) )
			.filter( ( group ) => group.count > 0 );

		const sizeSet = new Set();
		const colorMap = new Map();

		products.forEach( ( product ) => {
			product.sizes.forEach( ( size ) => sizeSet.add( size ) );
			product.colors.forEach( ( color ) => colorMap.set( color.slug, color ) );
		} );

		return {
			groups: groupOptions,
			sizes: sortSizes( [ ...sizeSet ] ).map( ( size ) => ( {
				slug: size,
				label: size.toUpperCase(),
				isActive: filters.sizes.includes( size ),
			} ) ),
			colors: [ ...colorMap.values() ]
				.sort( ( a, b ) => a.label.localeCompare( b.label ) )
				.map( ( color ) => ( { ...color, isActive: filters.colors.includes( color.slug ) } ) ),
		};
	}, [ products, groups, filters ] );

	/** One removable chip per applied filter. */
	const chips = useMemo( () => {

		const list = [];

		filters.groups.forEach( ( slug ) => list.push( {
			key: `group-${ slug }`,
			label: groups.find( ( group ) => group.slug === slug )?.name ?? slug,
			remove: () => toggle( 'groups', slug ),
		} ) );

		filters.sizes.forEach( ( size ) => list.push( {
			key: `size-${ size }`,
			label: `Size ${ size.toUpperCase() }`,
			remove: () => toggle( 'sizes', size ),
		} ) );

		filters.colors.forEach( ( slug ) => list.push( {
			key: `color-${ slug }`,
			label: facets.colors.find( ( color ) => color.slug === slug )?.label ?? slug,
			remove: () => toggle( 'colors', slug ),
		} ) );

		if ( filters.price ) {
			list.push( {
				key: 'price',
				label: PRICE_BANDS.find( ( band ) => band.id === filters.price )?.label ?? '',
				remove: () => update( { price: '' } ),
			} );
		}

		if ( filters.inStock ) {
			list.push( { key: 'in-stock', label: 'In stock', remove: () => update( { inStock: false } ) } );
		}

		return list;
	}, [ filters, groups, facets.colors ] ); // eslint-disable-line react-hooks/exhaustive-deps

	return {
		filters,
		update,
		toggle,
		clearAll,
		facets,
		chips,
		activeCount: chips.length,
		results: sorted.slice( pageStart, pageStart + PRODUCTS_PER_PAGE ),
		total: sorted.length,
		page: currentPage,
		totalPages,
		setPage,
		rangeStart: sorted.length ? pageStart + 1 : 0,
		rangeEnd: Math.min( pageStart + PRODUCTS_PER_PAGE, sorted.length ),
	};
};

export default useCatalogFilters;
