import Link from 'next/link';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import Img from '../ui/Img';
import { useUI } from '../context/UIContext';
import { GET_RECENTLY_VIEWED } from '../../queries/get-recently-viewed';
import { normaliseProducts, orderBySlugs } from '../../utils/product';

/**
 * Recently viewed strip.
 *
 * The slug list is browser-local, so the products behind it are fetched on the
 * client. Renders nothing until there is something other than the current
 * product to show.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx|null}
 */
const RecentlyViewed = ( { excludeSlug = '' } ) => {

	const { recentlyViewed } = useUI();

	const slugs = recentlyViewed.filter( ( slug ) => slug !== excludeSlug ).slice( 0, 6 );

	const { data } = useQuery( GET_RECENTLY_VIEWED, {
		variables: { slugs },
		skip: ! slugs.length,
	} );

	const products = orderBySlugs( normaliseProducts( data?.products?.nodes ), slugs );

	if ( ! products.length ) {
		return null;
	}

	return (
		<section aria-labelledby="recently-viewed-title" className="mt-16">
			<h2 id="recently-viewed-title" className="font-display text-4xl uppercase leading-none text-cream">Recently viewed</h2>
			<ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
				{ products.map( ( product ) => (
					<li key={ product.slug }>
						<Link href={ product.href } className="group block overflow-hidden rounded-md bg-petrol ring-1 ring-white/10 transition hover:ring-ember">
							<span className="relative block aspect-square overflow-hidden bg-ember">
								<Img
									src={ product.image }
									alt=""
									sizes="(min-width: 1024px) 16vw, 50vw"
									className="transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
								/>
							</span>
							<span className="block p-3">
								<span className="block truncate text-sm font-semibold text-cream">{ product.name }</span>
								<span className="text-sm text-flame">{ product.priceLabel }</span>
							</span>
						</Link>
					</li>
				) ) }
			</ul>
		</section>
	);
};

RecentlyViewed.propTypes = {
	excludeSlug: PropTypes.string,
};

export default RecentlyViewed;
