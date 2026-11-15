import Layout from "../src/components/Layout";
import Catalog from "../src/components/catalog/Catalog";
import client from "../src/components/ApolloClient";

import { GET_SHOP_CATALOG, GET_POPULARITY_ORDER } from "../src/queries/get-catalog";
import GET_NAV_CATEGORIES from "../src/queries/get-nav-categories";
import { normaliseProducts, withGroupSlug } from "../src/utils/product";
import { SHOP_EDITORIAL } from "../src/constants/categories";
import { CATEGORY_ORDER } from "../src/constants/nav";
import { editorialImage } from "../src/utils/media";

/**
 * Full catalog.
 *
 * @param {Object} props Page props.
 *
 * @return {jsx}
 */
export default function Shop( { products = [], popularityOrder = [], groups = [] } ) {

	return (
		<Layout title="Shop all — WooNext" description={ SHOP_EDITORIAL.blurb }>
			<Catalog
				uid="shop"
				products={ products }
				popularityOrder={ popularityOrder }
				groups={ groups }
				groupLegend="Category"
				hero={ {
					kicker: SHOP_EDITORIAL.kicker,
					title: SHOP_EDITORIAL.title,
					blurb: SHOP_EDITORIAL.blurb,
					images: SHOP_EDITORIAL.heroImages.map( editorialImage ),
				} }
				crumbs={ [ { label: 'Home', href: '/' }, { label: 'Shop' } ] }
			/>
		</Layout>
	);
}

export async function getStaticProps() {

	const [ { data }, { data: popularity }, { data: nav } ] = await Promise.all( [
		client.query( { query: GET_SHOP_CATALOG, variables: { first: 100 } } ),
		client.query( { query: GET_POPULARITY_ORDER, variables: { first: 100 } } ),
		client.query( { query: GET_NAV_CATEGORIES } ),
	] );

	// Departments only — New and Offers describe state, not a department.
	const groups = ( nav?.productCategories?.nodes ?? [] )
		.filter( ( node ) => ! [ 'new', 'offers', 'uncategorized' ].includes( node.slug ) )
		.map( ( node ) => ( { slug: node.slug, name: node.name } ) )
		.sort( ( a, b ) => CATEGORY_ORDER.indexOf( a.slug ) - CATEGORY_ORDER.indexOf( b.slug ) );

	return {
		props: {
			products: withGroupSlug( normaliseProducts( data?.products?.nodes ) ),
			popularityOrder: ( popularity?.products?.nodes ?? [] ).map( ( node ) => node.slug ),
			groups,
		},
		revalidate: 60,
	};
}
