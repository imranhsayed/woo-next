import { useRouter } from "next/router";

import Layout from "../../src/components/Layout";
import Catalog from "../../src/components/catalog/Catalog";
import client from "../../src/components/ApolloClient";

import { GET_CATEGORY_CATALOG, GET_CATEGORY_SLUGS, GET_POPULARITY_ORDER } from "../../src/queries/get-catalog";
import GET_NAV_CATEGORIES from "../../src/queries/get-nav-categories";
import { normaliseProducts, withGroupSlug } from "../../src/utils/product";
import { categoryEditorial } from "../../src/constants/categories";
import { CATEGORY_ORDER, categoryHref } from "../../src/constants/nav";
import { editorialImage } from "../../src/utils/media";
import { decodeHtmlEntities } from "../../src/functions";

/**
 * Strip markup from a term description.
 *
 * @param {string} html Description markup.
 *
 * @return {string} Plain text.
 */
const toPlainText = ( html ) => decodeHtmlEntities( ( html ?? '' ).replace( /<[^>]*>/g, '' ) ).trim();

/**
 * Category landing page.
 *
 * A subcategory renders its department's catalog with that type pre-applied as
 * a filter, the way the prototype does — so moving between types never reloads
 * the page or loses the other filters.
 *
 * @param {Object} props Page props.
 *
 * @return {jsx}
 */
export default function CategoryPage( props ) {

	const router = useRouter();

	if ( router.isFallback ) {
		return (
			<Layout title="Loading — WooNext">
				<div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
					<div className="h-10 w-56 animate-pulse rounded bg-petrol" />
					<ul className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-3">
						{ [ 1, 2, 3, 4, 5, 6 ].map( ( key ) => (
							<li key={ key } className="flex animate-pulse flex-col gap-3 rounded-md bg-petrol p-3">
								<div className="aspect-portrait rounded bg-teal" />
								<div className="h-4 w-2/3 rounded bg-teal" />
								<div className="h-10 rounded bg-teal" />
							</li>
						) ) }
					</ul>
				</div>
			</Layout>
		);
	}

	const {
		department,
		pageTitle,
		products = [],
		popularityOrder = [],
		groups = [],
		groupLegend,
		subNav = [],
		activeSubSlug = '',
		initialGroups = [],
		crumbs = [],
	} = props;

	const editorial = categoryEditorial( department.slug, department.name );

	return (
		<Layout title={ `${ pageTitle } — WooNext` } description={ department.description }>
			<Catalog
				uid={ `category-${ activeSubSlug || department.slug }` }
				products={ products }
				popularityOrder={ popularityOrder }
				groups={ groups }
				groupLegend={ groupLegend }
				subNav={ subNav }
				activeSubSlug={ activeSubSlug }
				initialGroups={ initialGroups }
				hero={ {
					kicker: editorial.kicker,
					title: editorial.title,
					blurb: department.description,
					images: editorial.heroImages.map( editorialImage ),
				} }
				crumbs={ crumbs }
			/>
		</Layout>
	);
}

export async function getStaticProps( { params: { slug } } ) {

	const { data: requested } = await client.query( {
		query: GET_CATEGORY_CATALOG,
		variables: { slug, first: 100 },
	} );

	const node = requested?.productCategory;

	if ( ! node ) {
		return { notFound: true, revalidate: 60 };
	}

	/**
	 * A subcategory borrows its department's catalog, so the type filter can be
	 * changed without a page load. The department is already loaded when the
	 * requested term is top level.
	 */
	const parentSlug = node.parent?.node?.slug ?? '';
	const isChild = !! parentSlug;

	let department = node;

	if ( isChild ) {
		const { data: parent } = await client.query( {
			query: GET_CATEGORY_CATALOG,
			variables: { slug: parentSlug, first: 100 },
		} );

		if ( parent?.productCategory ) {
			department = parent.productCategory;
		}
	}

	const { data: popularity } = await client.query( {
		query: GET_POPULARITY_ORDER,
		variables: { first: 100 },
	} );

	const children = department.children?.nodes ?? [];

	// With children, group by type; without, group by department.
	const products = withGroupSlug(
		normaliseProducts( department.products?.nodes ),
		children.length ? department.databaseId : null
	);

	/**
	 * With children, the sidebar offers types. Without them — New, Offers, or a
	 * childless department — it offers the departments the products fall into,
	 * counted within this set.
	 */
	let groups = children.map( ( child ) => ( { slug: child.slug, name: child.name } ) );

	if ( ! children.length ) {
		const { data: nav } = await client.query( { query: GET_NAV_CATEGORIES } );
		const present = new Set( products.map( ( product ) => product.groupSlug ) );

		groups = ( nav?.productCategories?.nodes ?? [] )
			.filter( ( item ) => present.has( item.slug ) )
			.map( ( item ) => ( { slug: item.slug, name: item.name } ) )
			.sort( ( a, b ) => CATEGORY_ORDER.indexOf( a.slug ) - CATEGORY_ORDER.indexOf( b.slug ) );
	}

	const subNav = children.length
		? [
			{ slug: '', name: 'All', href: categoryHref( department.slug ), count: products.length },
			...children.map( ( child ) => ( {
				slug: child.slug,
				name: child.name,
				href: categoryHref( child.slug ),
				count: products.filter( ( product ) => product.groupSlug === child.slug ).length,
			} ) ),
		]
		: [];

	const crumbs = [ { label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' } ];

	if ( isChild ) {
		crumbs.push( { label: department.name, href: categoryHref( department.slug ) } );
	}

	crumbs.push( { label: node.name } );

	return {
		props: {
			department: {
				name: department.name,
				slug: department.slug,
				description: toPlainText( department.description ),
			},
			pageTitle: node.name,
			products,
			popularityOrder: ( popularity?.products?.nodes ?? [] ).map( ( item ) => item.slug ),
			groups,
			groupLegend: children.length ? 'Type' : 'Category',
			subNav,
			activeSubSlug: isChild ? node.slug : '',
			initialGroups: isChild ? [ node.slug ] : [],
			crumbs,
		},
		revalidate: 60,
	};
}

export async function getStaticPaths() {

	const { data } = await client.query( { query: GET_CATEGORY_SLUGS } );

	const paths = ( data?.productCategories?.nodes ?? [] )
		.filter( ( node ) => node.slug && 'uncategorized' !== node.slug )
		.map( ( node ) => ( { params: { slug: node.slug } } ) );

	return { paths, fallback: true };
}
