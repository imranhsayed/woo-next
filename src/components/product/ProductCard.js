import Link from 'next/link';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import { useUI } from '../context/UIContext';
import useAddToCart from '../../hooks/useAddToCart';

/**
 * Product card.
 *
 * Portrait image that swaps to the gallery shot on hover, stacked badges for
 * sale / new / stock state, a wishlist toggle, quick view, the price with its
 * struck-through original, colour swatches and the add-to-bag control.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const ProductCard = ( { product, priority = false, sizes = '(min-width: 1024px) 25vw, 50vw' } ) => {

	const { isWishlisted, toggleWishlist, openQuickView } = useUI();
	const { addToCart, adding } = useAddToCart();

	if ( ! product ) {
		return <div className="aspect-portrait w-full animate-pulse rounded-md bg-petrol" />;
	}

	const isSaved = isWishlisted( product.databaseId );

	const addLabel = product.isSoldOut
		? 'Sold out'
		: 'VARIABLE' === product.type ? 'Select options' : 'Add to bag';

	return (
		<article className="group relative flex h-full flex-col overflow-hidden rounded-md bg-petrol ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 hover:ring-ember/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
			<div className="relative aspect-portrait overflow-hidden bg-teal">
				<Link
					href={ product.href }
					aria-label={ `${ product.name } — view product` }
					className="absolute inset-0 block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-flame"
				>
					{ /* The product's own name beats the attachment alt text: images are
					     shared between products, so the stored alt can name another one. */ }
					<Img
						src={ product.image }
						alt={ product.name }
						sizes={ sizes }
						priority={ priority }
						className="transition duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
					/>
					{ product.hoverImage ? (
						<Img
							src={ product.hoverImage }
							alt=""
							sizes={ sizes }
							className="opacity-0 transition duration-500 group-hover:opacity-100 motion-reduce:transition-none"
						/>
					) : null }
					<span className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
				</Link>

				<div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
					{ product.onSale && product.discount > 0 ? (
						<span className="rounded bg-ember px-2 py-1 text-xs font-bold uppercase tracking-wider text-midnight">Flat { product.discount }% off</span>
					) : null }
					{ product.isNew ? (
						<span className="rounded bg-cream px-2 py-1 text-xs font-bold uppercase tracking-wider text-midnight">New</span>
					) : null }
					{ product.isSoldOut ? (
						<span className="rounded bg-midnight/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-peach ring-1 ring-peach/40">Sold out</span>
					) : null }
					{ ! product.isSoldOut && product.isLowStock ? (
						<span className="rounded bg-midnight/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-flame">Only { product.stockQuantity } left</span>
					) : null }
					{ product.isDownloadable ? (
						<span className="rounded bg-midnight/90 px-2 py-1 text-xs font-bold uppercase tracking-wider text-cream ring-1 ring-cream/30">Digital</span>
					) : null }
				</div>

				<button
					type="button"
					onClick={ ( event ) => {
						event.preventDefault();
						toggleWishlist( product.databaseId, product.name );
					} }
					aria-pressed={ isSaved }
					aria-label={ `${ isSaved ? 'Remove' : 'Add' } ${ product.name } ${ isSaved ? 'from' : 'to' } wishlist` }
					className={ cx(
						'absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame active:scale-90 motion-reduce:transition-none',
						isSaved
							? 'bg-ember text-midnight shadow-lg shadow-ember/40'
							: 'bg-midnight/60 text-cream ring-1 ring-cream/30 backdrop-blur hover:bg-cream hover:text-rust'
					) }
				>
					<Icon name="heart" fill={ isSaved } />
				</button>

				<div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
					<div className="min-w-0">
						<p className="text-xs font-semibold uppercase tracking-widest text-peach/90">{ product.subCategory }</p>
						<h3 className="font-display text-xl uppercase leading-tight tracking-wide text-cream sm:text-2xl">
							<Link href={ product.href } className="transition-colors hover:text-flame focus-visible:underline focus-visible:outline-none">
								{ product.name }
							</Link>
						</h3>
					</div>
					<button
						type="button"
						onClick={ () => openQuickView( product.slug ) }
						aria-label={ `Quick view ${ product.name }` }
						className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream/15 text-cream ring-1 ring-cream/30 backdrop-blur transition duration-200 hover:bg-cream hover:text-midnight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame"
					>
						<Icon name="eye" className="h-4 w-4" />
					</button>
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-3 p-3 sm:p-4">
				<div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
					<span className="font-display text-xl tracking-wide text-flame">{ product.priceLabel }</span>
					{ product.onSale ? (
						<>
							<span className="text-sm text-peach/60 line-through">{ product.regularPriceLabel }</span>
							<span className="sr-only">Sale price</span>
						</>
					) : null }
				</div>

				{ product.colors.length ? (
					<div className="flex items-center gap-1.5" aria-label="Available colours">
						{ product.colors.map( ( color ) => (
							<span key={ color.slug } title={ color.label } className={ cx( 'h-3.5 w-3.5 rounded-full ring-1 ring-white/30', color.className ) } />
						) ) }
						<span className="ml-1 text-xs text-peach/70">
							{ product.sizes.length ? `${ product.sizes.length } sizes` : 'One size' }
						</span>
					</div>
				) : null }

				<button
					type="button"
					onClick={ () => addToCart( product ) }
					disabled={ product.isSoldOut || adding }
					className="group/btn mt-auto inline-flex min-h-11 items-center justify-between gap-2 rounded-md bg-rust px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-cream transition duration-200 hover:bg-ember hover:text-midnight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame disabled:cursor-not-allowed disabled:bg-navy disabled:text-peach/50 motion-reduce:transition-none"
				>
					<span>{ adding ? 'Adding…' : addLabel }</span>
					<span className="grid h-6 w-6 place-items-center rounded-full bg-cream/20 transition-transform duration-200 group-hover/btn:-rotate-45 group-hover/btn:translate-x-1 motion-reduce:transform-none">
						<Icon name="arrow-right" className="h-3.5 w-3.5" />
					</span>
				</button>
			</div>
		</article>
	);
};

ProductCard.propTypes = {
	product: PropTypes.object,
	priority: PropTypes.bool,
	sizes: PropTypes.string,
};

export default ProductCard;
