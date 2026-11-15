import Layout from "../../src/components/Layout";
import Catalog from "../../src/components/catalog/Catalog";
import client from "../../src/components/ApolloClient";

import { GET_SEARCH_CATALOG, GET_POPULARITY_ORDER } from "../../src/queries/get-catalog";
import GET_NAV_CATEGORIES from "../../src/queries/get-nav-categories";
import { normaliseProducts, withGroupSlug } from "../../src/utils/product";
import { SEARCH_EDITORIAL } from "../../src/constants/categories";
import { CATEGORY_ORDER } from "../../src/constants/nav";
import { editorialImage } from "../../src/utils/media";

/**
 * Search results.
 *
 * Rendered per request rather than pre-built: the term is unbounded, so there
 * is no path list to generate.
 *
 * @param {Object} props Page props.
 *
 * @return {jsx}
 */
export default function SearchPage( { term = '', products = [], popularityOrder = [], groups = [] } ) {

	const count = products.length;

	return (
		<Layout title={ `Search: ${ term } — WooNext` }>
			<Catalog
				uid={ `search-${ term }` }
				products={ products }
				popularityOrder={ popularityOrder }
				groups={ groups }
				groupLegend="Category"
				searchTerm={ term }
				hero={ {
					kicker: SEARCH_EDITORIAL.kicker,
					title: term ? `“${ term }”` : 'Search',
					blurb: `${ count } ${ 1 === count ? 'product matches' : 'products match' } your search.`,
					images: SEARCH_EDITORIAL.heroImages.map( editorialImage ),
				} }
				crumbs={ [ { label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, { label: 'Search' } ] }
			/>
		</Layout>
	);
}

export async function getServerSideProps( { params } ) {

	const term = decodeURIComponent( params.query ?? '' ).trim();

	if ( ! term ) {
		return { redirect: { destination: '/shop', permanent: false } };
	}

	const [ { data }, { data: popularity }, { data: nav } ] = await Promise.all( [
		client.query( { query: GET_SEARCH_CATALOG, variables: { search: term, first: 100 } } ),
		client.query( { query: GET_POPULARITY_ORDER, variables: { first: 100 } } ),
		client.query( { query: GET_NAV_CATEGORIES } ),
	] );

	const products = withGroupSlug( normaliseProducts( data?.products?.nodes ) );

	// Offer only the departments the results actually fall into.
	const present = new Set( products.map( ( product ) => product.groupSlug ) );

	const groups = ( nav?.productCategories?.nodes ?? [] )
		.filter( ( node ) => present.has( node.slug ) )
		.map( ( node ) => ( { slug: node.slug, name: node.name } ) )
		.sort( ( a, b ) => CATEGORY_ORDER.indexOf( a.slug ) - CATEGORY_ORDER.indexOf( b.slug ) );

	return {
		props: {
			term,
			products,
			popularityOrder: ( popularity?.products?.nodes ?? [] ).map( ( item ) => item.slug ),
			groups,
		},
	};
}
