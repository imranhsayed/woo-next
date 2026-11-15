import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "../../src/components/Layout";
import client from "../../src/components/ApolloClient";

import ProductGallery from "../../src/components/product/ProductGallery";
import BuyBox from "../../src/components/product/BuyBox";
import ProductTabs from "../../src/components/product/ProductTabs";
import ProductCard from "../../src/components/product/ProductCard";
import RecentlyViewed from "../../src/components/product/RecentlyViewed";

import GET_PRODUCT, { GET_PRODUCT_SLUGS, GET_RELATED_PRODUCTS } from "../../src/queries/get-product";
import { normaliseProduct, normaliseProducts } from "../../src/utils/product";
import { useUI } from "../../src/components/context/UIContext";
import { categoryHref } from "../../src/constants/nav";
import { decodeHtmlEntities } from "../../src/functions";

/**
 * Strip markup and collapse whitespace.
 *
 * @param {string} html Markup.
 *
 * @return {string} Plain text.
 */
const toPlainText = ( html ) => decodeHtmlEntities( ( html ?? '' ).replace( /<[^>]*>/g, ' ' ) )
	.replace( /\s+/g, ' ' )
	.trim();

/**
 * Split the WooCommerce description into prose and spec bullets.
 *
 * The catalog seed writes the description as a paragraph followed by a list of
 * product details, which the design shows on two different tabs.
 *
 * @param {string} html Description markup.
 *
 * @return {{prose: string, details: Array}} Prose and bullet list.
 */
const splitDescription = ( html ) => {

	const source = html ?? '';
	const listMatch = source.match( /<ul[^>]*>([\s\S]*?)<\/ul>/i );

	const details = listMatch
		? [ ...listMatch[ 1 ].matchAll( /<li[^>]*>([\s\S]*?)<\/li>/gi ) ].map( ( match ) => toPlainText( match[ 1 ] ) )
		: [];

	return {
		prose: toPlainText( source.replace( /<ul[^>]*>[\s\S]*?<\/ul>/i, '' ) ),
		details: details.filter( Boolean ),
	};
};

/**
 * Records this product in the browser's recently-viewed list.
 *
 * @param {Object} props Component props.
 *
 * @return {null}
 */
const ViewRecorder = ( { slug } ) => {

	const { recordView } = useUI();

	useEffect( () => recordView( slug ), [ slug, recordView ] );

	return null;
};

/**
 * Single product page.
 *
 * @param {Object} props Page props.
 *
 * @return {jsx}
 */
export default function ProductPage( props ) {

	const router = useRouter();

	if ( router.isFallback ) {
		return (
			<Layout title="Loading — WooNext">
				<div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-12 lg:px-8">
					<div className="aspect-portrait animate-pulse rounded-md bg-petrol lg:col-span-7" />
					<div className="flex animate-pulse flex-col gap-4 lg:col-span-5">
						<div className="h-3 w-32 rounded bg-petrol" />
						<div className="h-14 w-3/4 rounded bg-petrol" />
						<div className="h-8 w-32 rounded bg-petrol" />
						<div className="h-24 w-full rounded bg-petrol" />
						<div className="h-12 w-full rounded bg-petrol" />
					</div>
				</div>
			</Layout>
		);
	}

	const { product, variations = [], images = [], description, details = [], reviews = [], ratingCounts = {}, related = [] } = props;

	if ( ! product ) {
		return (
			<Layout title="Product not found — WooNext">
				<div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
					<h1 className="font-display text-5xl uppercase text-cream">Product not found</h1>
					<p className="mt-4 text-sm text-peach/80">That piece has sold out of our catalogue or moved.</p>
					<Link href="/shop" className="mt-6 inline-flex min-h-12 items-center rounded-md bg-rust px-6 text-sm font-bold uppercase tracking-widest text-cream hover:bg-ember hover:text-midnight">
						Browse the shop
					</Link>
				</div>
			</Layout>
		);
	}

	return (
		<Layout title={ `${ product.name } — WooNext` } description={ product.shortDescription }>
			<ViewRecorder slug={ product.slug } />

			<div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
				<nav aria-label="Breadcrumb">
					<ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-peach/70">
						<li><Link href="/" className="hover:text-flame">Home</Link></li>
						<li aria-hidden="true">/</li>
						{ product.departmentSlug ? (
							<>
								<li><Link href={ categoryHref( product.departmentSlug ) } className="hover:text-flame">{ product.department }</Link></li>
								<li aria-hidden="true">/</li>
							</>
						) : null }
						{ product.subCategorySlug ? (
							<>
								<li><Link href={ categoryHref( product.subCategorySlug ) } className="hover:text-flame">{ product.subCategory }</Link></li>
								<li aria-hidden="true">/</li>
							</>
						) : null }
						<li aria-current="page" className="text-cream">{ product.name }</li>
					</ol>
				</nav>

				<div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
					<ProductGallery
						images={ images }
						name={ product.name }
						isOnSale={ product.onSale }
						isNew={ product.isNew }
					/>

					<div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
						<BuyBox
							product={ product }
							variations={ variations }
							shortDescription={ product.shortDescription }
						/>
					</div>
				</div>

				<ProductTabs
					product={ product }
					description={ description }
					details={ details }
					reviews={ reviews }
					ratingCounts={ ratingCounts }
				/>

				{ related.length ? (
					<section aria-labelledby="related-title" className="mt-8">
						<div className="flex items-end justify-between gap-4">
							<h2 id="related-title" className="font-display text-5xl uppercase leading-none text-cream">You may also like</h2>
							<Link href={ categoryHref( product.departmentSlug ) } className="text-sm font-bold uppercase tracking-widest text-flame hover:underline">
								View all
							</Link>
						</div>
						<ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
							{ related.map( ( item ) => (
								<li key={ item.slug }>
									<ProductCard product={ item } />
								</li>
							) ) }
						</ul>
					</section>
				) : null }

				<RecentlyViewed excludeSlug={ product.slug } />
			</div>
		</Layout>
	);
}

export async function getStaticProps( { params: { slug } } ) {

	const { data } = await client.query( { query: GET_PRODUCT, variables: { slug } } );

	const node = data?.product;

	if ( ! node ) {
		return { notFound: true, revalidate: 60 };
	}

	const product = normaliseProduct( node );
	const { prose, details } = splitDescription( node.description );

	// The featured image leads, then the gallery.
	const images = [
		...( node.image ? [ { sourceUrl: node.image.sourceUrl, altText: node.image.altText ?? '' } ] : [] ),
		...( node.gallery?.nodes ?? [] ).map( ( image ) => ( {
			sourceUrl: image.sourceUrl,
			altText: image.altText ?? '',
		} ) ),
	];

	// Rating sits on the review edge, not the comment node.
	const edges = node.reviews?.edges ?? [];

	const reviews = edges.map( ( edge ) => ( {
		id: edge.node.id,
		rating: edge.rating ?? 0,
		author: edge.node.author?.node?.name ?? 'Verified buyer',
		content: toPlainText( edge.node.content ),
		date: new Date( edge.node.date ).toLocaleDateString( 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' } ),
	} ) );

	const ratingCounts = reviews.reduce( ( counts, review ) => ( {
		...counts,
		[ review.rating ]: ( counts[ review.rating ] ?? 0 ) + 1,
	} ), {} );

	// Same department, most popular first, excluding this product.
	let related = [];

	if ( product.departmentSlug ) {
		const { data: relatedData } = await client.query( {
			query: GET_RELATED_PRODUCTS,
			variables: { category: product.departmentSlug, first: 5 },
		} );

		related = normaliseProducts( relatedData?.products?.nodes )
			.filter( ( item ) => item.slug !== product.slug )
			.slice( 0, 4 );
	}

	return {
		props: {
			product: {
				...product,
				sku: node.sku ?? '',
				shortDescription: toPlainText( node.shortDescription ),
			},
			variations: node.variations?.nodes ?? [],
			images,
			description: prose,
			details,
			reviews,
			ratingCounts,
			related,
		},
		revalidate: 60,
	};
}

export async function getStaticPaths() {

	const { data } = await client.query( { query: GET_PRODUCT_SLUGS } );

	const paths = ( data?.products?.nodes ?? [] )
		.filter( ( node ) => node.slug )
		.map( ( node ) => ( { params: { slug: node.slug } } ) );

	return { paths, fallback: true };
}
