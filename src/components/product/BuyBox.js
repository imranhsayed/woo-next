import Link from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import cx from 'classnames';

import Icon from '../ui/Icon';
import { useUI } from '../context/UIContext';
import useAddToCart from '../../hooks/useAddToCart';
import { buildVariationMatrix, findVariation, isSizeAvailable } from '../../utils/variations';
import { productHref } from '../../constants/nav';

/** Largest quantity offered when stock is not being tracked. */
const MAX_QUANTITY = 10;

/**
 * Buy box.
 *
 * Owns the variation choice: colour and size pickers driven by the product's
 * real WooCommerce variations, the resolved variation's price and stock, the
 * quantity stepper, add-to-bag, buy-now and the wishlist toggle.
 *
 * In `compact` mode it is the body of the quick-view dialog, which drops the
 * delivery panel and links through to the full page instead.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const BuyBox = ( {
	product,
	variations = [],
	shortDescription = '',
	compact = false,
	onAdded = null,
} ) => {

	const router = useRouter();
	const { toast, isWishlisted, toggleWishlist, openSizeGuide } = useUI();
	const { addToCart, adding } = useAddToCart();

	const matrix = useMemo( () => buildVariationMatrix( product, variations ), [ product, variations ] );

	const [ selection, setSelection ] = useState( { size: '', color: '' } );
	const [ quantity, setQuantity ] = useState( 1 );
	const [ hasTried, setTried ] = useState( false );

	/**
	 * Reset the choice when the product changes, auto-selecting a colour that
	 * is the only one available — a single option is not a decision.
	 */
	useEffect( () => {

		setSelection( { size: '', color: matrix.singleColor } );
		setQuantity( 1 );
		setTried( false );
	}, [ product.databaseId, matrix.singleColor ] );

	const variation = findVariation( matrix.variations, selection );

	const isVariable = 'VARIABLE' === product.type;
	const needsSize = matrix.varies.size && ! selection.size;
	const needsColor = matrix.varies.color && ! selection.color;

	// A resolved variation is authoritative for price and stock.
	const isSoldOut = product.isSoldOut || ( variation ? ! variation.isInStock : false );

	/**
	 * Narrow the displayed price as the choice narrows.
	 *
	 * A resolved variation is exact. Before that, a partial choice — a size,
	 * with the colour still open — already pins the price down whenever every
	 * variation it could still resolve to costs the same, which is how per-size
	 * pricing shows up the moment a size is picked.
	 */
	const candidates = matrix.variations.filter( ( item ) =>
		Object.entries( selection ).every( ( [ name, value ] ) => ! value || item.attributes[ name ] === value )
	);

	const pricePeer = variation
		?? ( candidates.length && candidates.every( ( item ) => item.priceLabel === candidates[ 0 ].priceLabel )
			? candidates[ 0 ]
			: null );

	const priceLabel = pricePeer ? pricePeer.priceLabel : product.priceLabel;
	const regularPriceLabel = pricePeer ? pricePeer.regularPriceLabel : product.regularPriceLabel;
	const onSale = pricePeer ? pricePeer.onSale : product.onSale;

	const stockQuantity = variation?.stockQuantity ?? product.stockQuantity;
	const maxQuantity = stockQuantity && stockQuantity > 0 ? Math.min( stockQuantity, MAX_QUANTITY ) : MAX_QUANTITY;

	const isSaved = isWishlisted( product.databaseId );

	/** The chosen pair exists but cannot be ordered. */
	const isComboSoldOut = !! variation && ! variation.isInStock;

	/**
	 * Confirm the selection is complete and orderable.
	 *
	 * @return {boolean} Whether to proceed.
	 */
	const validate = () => {

		if ( needsSize || needsColor ) {
			setTried( true );

			const missing = [ needsSize && 'a size', needsColor && 'a colour' ].filter( Boolean ).join( ' and ' );

			toast( `Please choose ${ missing } first`, { tone: 'warn' } );

			return false;
		}

		if ( isVariable && ! variation ) {
			toast( 'That combination is unavailable — try another', { tone: 'warn' } );
			return false;
		}

		if ( isComboSoldOut ) {
			toast( 'That combination is sold out — try another', { tone: 'warn' } );
			return false;
		}

		return true;
	};

	const submit = async ( { thenCheckout = false } = {} ) => {

		if ( ! validate() ) {
			return;
		}

		await addToCart( product, {
			quantity,
			variationId: variation?.databaseId ?? null,
		} );

		if ( thenCheckout ) {
			router.push( '/checkout' );
			return;
		}

		onAdded?.();
	};

	const stockMessage = isSoldOut
		? 'Out of stock'
		: product.isLowStock
			? `Low stock — only ${ product.stockQuantity } left`
			: product.isDownloadable
				? 'Instant digital download'
				: 'In stock, ready to ship';

	return (
		<div className="flex flex-col gap-6 text-peach">
			<div className="flex flex-col gap-3">
				<p className="text-xs font-semibold uppercase tracking-widest text-flame">
					{ product.department ? `${ product.department } · ` : '' }{ product.subCategory }
				</p>

				{ compact ? (
					<h2 className="font-display text-5xl uppercase leading-none tracking-wide text-cream sm:text-6xl">{ product.name }</h2>
				) : (
					<h1 className="font-display text-5xl uppercase leading-none tracking-wide text-cream sm:text-6xl">{ product.name }</h1>
				) }

				{ product.reviewCount > 0 ? (
					<div className="flex flex-wrap items-center gap-3 text-sm">
						<span className="flex items-center gap-0.5 text-flame" role="img" aria-label={ `Rated ${ product.rating } out of 5` }>
							{ [ 1, 2, 3, 4, 5 ].map( ( star ) => (
								<Icon key={ star } name="star" className="h-4 w-4" fill={ star <= Math.round( product.rating ) } />
							) ) }
						</span>
						<Link
							href={ compact ? productHref( product.slug ) : '#reviews' }
							className="text-peach/80 underline decoration-peach/30 underline-offset-4 transition-colors hover:text-cream"
						>
							{ product.rating } · { product.reviewCount } reviews
						</Link>
					</div>
				) : null }

				<div className="flex flex-wrap items-baseline gap-3">
					<span className="font-display text-4xl tracking-wide text-flame">{ priceLabel }</span>
					{ onSale ? (
						<>
							<span className="text-lg text-peach/60 line-through">
								<span className="sr-only">Regular price </span>{ regularPriceLabel }
							</span>
							{ product.discount > 0 ? (
								<span className="rounded bg-ember px-2 py-1 text-xs font-bold uppercase tracking-wider text-midnight">Save { product.discount }%</span>
							) : null }
						</>
					) : null }
				</div>

				{ shortDescription ? (
					<p className="max-w-prose text-base leading-relaxed text-peach/85">{ shortDescription }</p>
				) : null }
			</div>

			{ matrix.varies.color ? (
				<fieldset>
					<legend className="mb-3 text-xs font-bold uppercase tracking-widest text-cream">
						Colour: <span className="font-normal normal-case tracking-normal text-peach">
							{ matrix.colors.find( ( color ) => color.slug === selection.color )?.label ?? 'Choose a colour' }
						</span>
					</legend>
					<div className="flex flex-wrap gap-2">
						{ matrix.colors.map( ( color ) => {

							const isPicked = selection.color === color.slug;

							return (
								<button
									key={ color.slug }
									type="button"
									onClick={ () => setSelection( ( current ) => ( { ...current, color: color.slug } ) ) }
									aria-pressed={ isPicked }
									className={ cx(
										'flex min-h-11 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm ring-1 transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame',
										isPicked ? 'bg-cream text-midnight ring-cream' : 'text-peach ring-peach/30 hover:ring-peach'
									) }
								>
									<span className={ cx( 'h-7 w-7 rounded-full ring-1 ring-white/30', color.className ) } />
									{ color.label }
								</button>
							);
						} ) }
					</div>
					{ hasTried && needsColor ? (
						<p role="alert" className="mt-2 text-sm font-semibold text-flame">Select a colour to continue</p>
					) : null }
				</fieldset>
			) : null }

			{ matrix.varies.size ? (
				<fieldset>
					<div className="mb-3 flex items-center justify-between gap-3">
						<legend className="text-xs font-bold uppercase tracking-widest text-cream">
							Size: <span className="font-normal normal-case tracking-normal text-peach">
								{ selection.size ? selection.size.toUpperCase() : 'Choose a size' }
							</span>
						</legend>
						<button
							type="button"
							onClick={ openSizeGuide }
							className="inline-flex min-h-11 items-center gap-1.5 text-sm text-peach underline decoration-peach/40 underline-offset-4 transition-colors hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame"
						>
							<Icon name="ruler" className="h-4 w-4" />Size guide
						</button>
					</div>

					<div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
						{ matrix.sizes.map( ( size ) => {

							const isAvailable = isSizeAvailable( matrix.variations, size, selection.color );
							const isPicked = selection.size === size;

							return (
								<button
									key={ size }
									type="button"
									onClick={ () => setSelection( ( current ) => ( { ...current, size } ) ) }
									disabled={ ! isAvailable }
									aria-pressed={ isPicked }
									aria-label={ `${ size.toUpperCase() }${ isAvailable ? '' : ' — sold out' }` }
									className={ cx(
										'relative min-h-12 overflow-hidden rounded-md text-sm font-bold uppercase ring-1 transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame disabled:cursor-not-allowed',
										isPicked
											? 'bg-ember text-midnight ring-ember'
											: ! isAvailable
												? 'text-peach/30 ring-peach/15'
												: hasTried && needsSize
													? 'text-cream ring-flame'
													: 'text-cream ring-peach/30 hover:bg-white/5 hover:ring-cream'
									) }
								>
									{ size.toUpperCase() }
									{ ! isAvailable ? (
										<span className="absolute left-1/2 top-1/2 h-px w-16 -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-peach/40" />
									) : null }
								</button>
							);
						} ) }
					</div>

					{ hasTried && needsSize ? (
						<p role="alert" className="mt-3 flex items-center gap-2 text-sm font-semibold text-flame">
							<Icon name="alert" className="h-4 w-4" />Select a size to continue
						</p>
					) : isComboSoldOut ? (
						<p role="alert" className="mt-3 flex items-center gap-2 text-sm font-semibold text-flame">
							<Icon name="alert" className="h-4 w-4" />
							{ selection.size.toUpperCase() } in { matrix.colors.find( ( color ) => color.slug === selection.color )?.label ?? selection.color } is sold out
						</p>
					) : null }
				</fieldset>
			) : null }

			<p className={ cx(
				'flex items-center gap-2 text-sm font-semibold',
				isSoldOut ? 'text-peach/60' : product.isLowStock ? 'text-flame' : 'text-emerald-300'
			) }>
				<span className={ cx(
					'h-2 w-2 rounded-full',
					isSoldOut ? 'bg-peach/40' : product.isLowStock ? 'bg-flame' : 'bg-emerald-400'
				) } />
				{ stockMessage }
			</p>

			<div className="flex flex-wrap items-stretch gap-3">
				{ ! isSoldOut && ! product.isDownloadable ? (
					<div className="flex items-center rounded-md ring-1 ring-peach/30" role="group" aria-label="Quantity">
						<button
							type="button"
							onClick={ () => setQuantity( ( value ) => Math.max( 1, value - 1 ) ) }
							aria-label="Decrease quantity"
							className="grid h-12 w-11 place-items-center text-cream transition-colors hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame"
						>
							<Icon name="minus" className="h-4 w-4" />
						</button>
						<span className="w-8 text-center font-bold text-cream" aria-live="polite">{ quantity }</span>
						<button
							type="button"
							onClick={ () => setQuantity( ( value ) => Math.min( maxQuantity, value + 1 ) ) }
							aria-label="Increase quantity"
							className="grid h-12 w-11 place-items-center text-cream transition-colors hover:text-flame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame"
						>
							<Icon name="plus" className="h-4 w-4" />
						</button>
					</div>
				) : null }

				<button
					type="button"
					onClick={ () => submit() }
					disabled={ isSoldOut || adding }
					className="group inline-flex min-h-12 flex-1 items-center justify-center gap-3 rounded-md bg-rust px-6 text-sm font-bold uppercase tracking-widest text-cream transition duration-200 hover:bg-ember hover:text-midnight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame active:scale-95 disabled:cursor-not-allowed disabled:bg-navy disabled:text-peach/50 motion-reduce:transform-none motion-reduce:transition-none"
				>
					<Icon name="bag" />
					{ isSoldOut ? 'Sold out' : adding ? 'Adding…' : 'Add to bag' }
				</button>

				<button
					type="button"
					onClick={ () => toggleWishlist( product.databaseId, product.name ) }
					aria-pressed={ isSaved }
					aria-label={ isSaved ? 'Remove from wishlist' : 'Add to wishlist' }
					className={ cx(
						'grid h-12 w-12 place-items-center rounded-md ring-1 transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame active:scale-90',
						isSaved ? 'bg-ember text-midnight ring-ember' : 'text-cream ring-peach/30 hover:text-flame hover:ring-cream'
					) }
				>
					<Icon name="heart" fill={ isSaved } />
				</button>
			</div>

			{ ! isSoldOut ? (
				<button
					type="button"
					onClick={ () => submit( { thenCheckout: true } ) }
					disabled={ adding }
					className="group -mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-cream px-6 text-sm font-bold uppercase tracking-widest text-midnight transition duration-200 hover:bg-peach focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame disabled:opacity-70"
				>
					Buy it now
					<span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
						<Icon name="arrow-right" className="h-4 w-4" />
					</span>
				</button>
			) : null }

			{ compact ? (
				<Link
					href={ productHref( product.slug ) }
					className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-flame underline-offset-4 hover:underline"
				>
					View full details
					<Icon name="arrow-up-right" className="h-4 w-4" />
				</Link>
			) : (
				<ul className="grid gap-3 rounded-md bg-navy/60 p-4 text-sm ring-1 ring-white/10 sm:grid-cols-2">
					<li className="flex gap-3">
						<span className="text-flame"><Icon name="truck" /></span>
						<span>
							<strong className="block text-cream">
								{ product.isDownloadable ? 'Instant delivery' : 'Free shipping over 75 €' }
							</strong>
							{ product.isDownloadable
								? 'Download from your account right after purchase.'
								: 'Standard 3–5 working days, or express 1–2 days.' }
						</span>
					</li>
					<li className="flex gap-3">
						<span className="text-flame"><Icon name="returns" /></span>
						<span>
							<strong className="block text-cream">30-day returns</strong>
							Free exchanges within 30 days. <Link href="/page/returns" className="underline underline-offset-2 hover:text-flame">Returns policy</Link>
						</span>
					</li>
				</ul>
			) }
		</div>
	);
};

BuyBox.propTypes = {
	product: PropTypes.object.isRequired,
	variations: PropTypes.array,
	shortDescription: PropTypes.string,
	compact: PropTypes.bool,
	onAdded: PropTypes.func,
};

export default BuyBox;
