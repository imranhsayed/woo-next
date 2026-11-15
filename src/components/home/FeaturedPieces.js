import Link from 'next/link';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import ProductCard from '../product/ProductCard';
import { useUI } from '../context/UIContext';
import useReveal, { revealClass } from '../../hooks/useReveal';
import { FEATURED, TRENDING } from '../../constants/home';

/**
 * Featured pieces and the trending row.
 *
 * Three editorial tiles carry the discount flash and a wishlist toggle, then
 * the "Fresh off the rail" heading leads into four product cards.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const FeaturedPieces = ( { featured = [], trending = [] } ) => {

	const [ ref, isRevealed ] = useReveal();
	const { isWishlisted, toggleWishlist } = useUI();

	return (
		<section
			ref={ ref }
			aria-labelledby="featured-title"
			className={ cx(
				'mx-auto w-full max-w-7xl px-4 transition duration-500 motion-reduce:transition-none sm:px-6 lg:px-8',
				revealClass( isRevealed )
			) }
		>
			<h2 id="featured-title" className="sr-only">Featured pieces</h2>

			<div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
				{ featured.map( ( product ) => {

					const layout = FEATURED.find( ( item ) => item.slug === product.slug );
					const isSaved = isWishlisted( product.databaseId );

					return (
						<article
							key={ product.slug }
							className={ cx( 'group relative overflow-hidden rounded-md bg-teal ring-1 ring-white/10', layout?.span ) }
						>
							<Link
								href={ product.href }
								className="block h-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-flame"
							>
								<Img
									src={ product.image }
									alt={ product.name }
									sizes="(min-width: 768px) 33vw, 100vw"
									className="transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
								/>
								<span className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-transparent to-midnight/30" />
							</Link>

							{ product.discount > 0 ? (
								<p className="pointer-events-none absolute left-4 top-4 font-display text-lg uppercase leading-none text-cream sm:text-xl">
									Flat<br />{ product.discount }% off
								</p>
							) : null }

							<button
								type="button"
								onClick={ () => toggleWishlist( product.databaseId, product.name ) }
								aria-pressed={ isSaved }
								aria-label={ `${ isSaved ? 'Remove' : 'Add' } ${ product.name } ${ isSaved ? 'from' : 'to' } wishlist` }
								className={ cx(
									'absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame active:scale-90 motion-reduce:transition-none',
									isSaved
										? 'bg-ember text-midnight'
										: 'bg-midnight/60 text-cream ring-1 ring-cream/40 backdrop-blur hover:bg-cream hover:text-rust'
								) }
							>
								<Icon name="heart" fill={ isSaved } />
							</button>

							<div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
								<p className="font-display text-2xl uppercase leading-none text-cream sm:text-3xl">
									{ layout?.shortName ?? product.name }
								</p>
								<p className="font-display text-xl text-flame sm:text-2xl">{ product.priceLabel }</p>
							</div>
						</article>
					);
				} ) }
			</div>

			<div className="mt-10 flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-xs font-bold uppercase tracking-widest text-flame">{ TRENDING.kicker }</p>
					<h2 className="font-display text-5xl uppercase leading-none text-cream sm:text-6xl">{ TRENDING.title }</h2>
				</div>
				<Link href={ TRENDING.link.href } className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-cream">
					<span className="relative">
						{ TRENDING.link.label }
						<span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-flame transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none" />
					</span>
					<span className="grid h-11 w-11 place-items-center rounded-full bg-ember text-midnight transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transform-none">
						<Icon name="arrow-right" className="h-4 w-4" />
					</span>
				</Link>
			</div>

			<ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
				{ trending.map( ( product ) => (
					<li key={ product.slug }>
						<ProductCard product={ product } />
					</li>
				) ) }
			</ul>
		</section>
	);
};

FeaturedPieces.propTypes = {
	featured: PropTypes.array,
	trending: PropTypes.array,
};

export default FeaturedPieces;
