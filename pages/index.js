import Layout from "../src/components/Layout";
import client from "../src/components/ApolloClient";

import Hero from "../src/components/home/Hero";
import ServicesStrip from "../src/components/home/ServicesStrip";
import CategoryTiles from "../src/components/home/CategoryTiles";
import FeaturedPieces from "../src/components/home/FeaturedPieces";
import StorySection from "../src/components/home/StorySection";
import BrandStrip from "../src/components/home/BrandStrip";
import SaleBanner from "../src/components/home/SaleBanner";
import StoreMosaic from "../src/components/home/StoreMosaic";
import StyleTicker from "../src/components/home/StyleTicker";
import Testimonials from "../src/components/home/Testimonials";
import FaqAccordion from "../src/components/home/FaqAccordion";

import GET_HOME, { buildTickerCountsQuery } from "../src/queries/get-home";
import { FEATURED, TICKER, TRENDING } from "../src/constants/home";
import { normaliseProducts, orderBySlugs } from "../src/utils/product";

/**
 * Storefront home page.
 *
 * @param {Object} props Page props.
 *
 * @return {jsx}
 */
export default function Home( { featured = [], trending = [], tickerCounts = {} } ) {

	return (
		<Layout
			title="WooNext — Step Back Into Style"
			description="Timeless retro pieces with a modern twist — tailored for the bold, the bright and the everyday."
		>
			<div className="flex flex-col gap-4 pb-4 sm:gap-6">
				<Hero />
				<ServicesStrip />
				<CategoryTiles />
				<FeaturedPieces featured={ featured } trending={ trending } />
				<StorySection />
				<BrandStrip />
				<SaleBanner />
				<StoreMosaic />
				<StyleTicker counts={ tickerCounts } />
				<Testimonials />
				<FaqAccordion />
			</div>
		</Layout>
	);
}

export async function getStaticProps() {

	const featuredSlugs = FEATURED.map( ( item ) => item.slug );

	const { data } = await client.query( {
		query: GET_HOME,
		variables: { featuredSlugs, trendingSlugs: TRENDING.slugs },
	} );

	// Ticker terms resolve to product counts; the "Fashion" tile uses the total.
	const searchTerms = TICKER.filter( ( item ) => item.search ).map( ( item ) => item.search );

	const { data: counts } = await client.query( {
		query: buildTickerCountsQuery( searchTerms ),
	} );

	const tickerCounts = { total: data?.catalog?.found ?? 0 };

	searchTerms.forEach( ( term, index ) => {
		tickerCounts[ term ] = counts?.[ `term_${ index }` ]?.found ?? 0;
	} );

	return {
		props: {
			// GraphQL ignores `slugIn` ordering, so restore the editorial order.
			featured: orderBySlugs( normaliseProducts( data?.featured?.nodes ), featuredSlugs ),
			trending: orderBySlugs( normaliseProducts( data?.trending?.nodes ), TRENDING.slugs ),
			tickerCounts,
		},
		revalidate: 60,
	};
}
