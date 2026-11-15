import { useQuery } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';

import GET_NAV_CATEGORIES from '../queries/get-nav-categories';
import { CATEGORY_ORDER, categoryHref } from '../constants/nav';

/**
 * Sort categories into the prototype's display order.
 *
 * Anything not in `CATEGORY_ORDER` keeps a stable place at the end so
 * categories added in WordPress still appear in the nav.
 *
 * @param {Array} categories Category nodes.
 *
 * @return {Array} Sorted copy.
 */
const byConfiguredOrder = ( categories ) => [ ...categories ].sort( ( a, b ) => {

	const aIndex = CATEGORY_ORDER.indexOf( a.slug );
	const bIndex = CATEGORY_ORDER.indexOf( b.slug );

	if ( -1 === aIndex && -1 === bIndex ) {
		return a.name.localeCompare( b.name );
	}

	return ( -1 === aIndex ? Infinity : aIndex ) - ( -1 === bIndex ? Infinity : bIndex );
} );

/**
 * Top-level product categories for the shell navigation.
 *
 * Returns categories already sorted, with hrefs resolved and `Uncategorized`
 * filtered out, plus a `bySlug` lookup for the header and footer.
 *
 * @return {{categories: Array, bySlug: Object, loading: boolean, error: Object}}
 */
const useNavCategories = () => {

	/**
	 * Only surface categories after mount.
	 *
	 * Pages fetch their own data through the same Apollo client, so during a
	 * build its cache can already hold this query — which would put categories
	 * into the prerendered HTML that the browser cannot reproduce on its first
	 * render. Everything this feeds (mega menu, mobile drawer, search overlay)
	 * is behind an interaction, so withholding it until mount costs nothing.
	 */
	const [ hasMounted, setMounted ] = useState( false );

	useEffect( () => setMounted( true ), [] );

	const { data, loading, error } = useQuery( GET_NAV_CATEGORIES, {
		fetchPolicy: 'cache-first',
	} );

	return useMemo( () => {

		const nodes = ( hasMounted ? data?.productCategories?.nodes ?? [] : [] )
			.filter( ( node ) => 'uncategorized' !== node.slug );

		const categories = byConfiguredOrder( nodes ).map( ( node ) => ( {
			id: node.id,
			databaseId: node.databaseId,
			name: node.name,
			slug: node.slug,
			count: node.count ?? 0,
			description: node.description ?? '',
			image: node.image ?? null,
			href: categoryHref( node.slug ),
			// Subcategories sort alphabetically: WooCommerce holds their intended
			// order in term meta, which WPGraphQL does not expose yet.
			children: [ ...( node.children?.nodes ?? [] ) ]
				.sort( ( a, b ) => a.name.localeCompare( b.name ) )
				.map( ( child ) => ( {
					id: child.id,
					databaseId: child.databaseId,
					name: child.name,
					slug: child.slug,
					count: child.count ?? 0,
					href: categoryHref( child.slug ),
				} ) ),
		} ) );

		const bySlug = Object.fromEntries( categories.map( ( category ) => [ category.slug, category ] ) );

		return { categories, bySlug, loading, error };
	}, [ data, loading, error, hasMounted ] );
};

export default useNavCategories;
