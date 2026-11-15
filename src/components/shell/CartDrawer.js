import Link from 'next/link';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import useFocusTrap from '../../hooks/useFocusTrap';
import useCart from '../../hooks/useCart';
import { FREE_SHIPPING_THRESHOLD, productHref } from '../../constants/nav';

/**
 * Tailwind width classes for the free-shipping meter.
 *
 * Listed so the compiler sees them; an interpolated `w-[x%]` would be purged.
 */
const PROGRESS_WIDTHS = [
	'w-0', 'w-1/12', 'w-2/12', 'w-3/12', 'w-4/12', 'w-5/12',
	'w-6/12', 'w-7/12', 'w-8/12', 'w-9/12', 'w-10/12', 'w-11/12', 'w-full',
];

/**
 * Describe the chosen variation, e.g. "Size M · Rust".
 *
 * @param {Object} item Formatted cart line.
 *
 * @return {string} Human-readable variation.
 */
const variationLabel = ( item ) => {

	const parts = ( item.attributes ?? [] ).map( ( attribute ) => {

		const value = attribute.value.replace( /-/g, ' ' );
		const titled = value.charAt( 0 ).toUpperCase() + value.slice( 1 );

		return 'size' === attribute.name ? `Size ${ titled.toUpperCase() }` : titled;
	} );

	if ( parts.length ) {
		return parts.join( ' · ' );
	}

	return 'EXTERNAL' === item.type ? '' : 'One size';
};

/**
 * Format a number as a store-currency price.
 *
 * The drawer derives per-unit prices locally, so it needs its own formatter;
 * WooCommerce's formatted strings are used wherever they exist.
 *
 * @param {number} amount Amount.
 *
 * @return {string} Formatted price.
 */
const formatPrice = ( amount ) => `${ ( Math.round( amount * 100 ) / 100 ).toFixed( 2 ).replace( '.', ',' ) } €`;

/**
 * Slide-over bag.
 *
 * Shows the live WooCommerce cart with per-line quantity controls, a
 * free-shipping meter and the subtotal.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const CartDrawer = ( { isOpen, onClose } ) => {

	const panelRef = useFocusTrap( isOpen, onClose );
	const { products, count, subtotal, subtotalValue, isEmpty, updating, setQuantity, removeItem } = useCart();

	const remaining = Math.max( 0, FREE_SHIPPING_THRESHOLD - subtotalValue );
	const percent = subtotalValue >= FREE_SHIPPING_THRESHOLD ? 100 : Math.round( ( subtotalValue / FREE_SHIPPING_THRESHOLD ) * 100 );
	const progressWidth = PROGRESS_WIDTHS[ Math.round( ( percent / 100 ) * 12 ) ];

	return (
		<div
			className={ cx(
				'fixed inset-0 z-50 transition-all duration-300 motion-reduce:transition-none',
				isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
			) }
			aria-hidden={ isOpen ? 'false' : 'true' }
		>
			<div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" onClick={ onClose } />

			<aside
				ref={ panelRef }
				role="dialog"
				aria-modal="true"
				aria-labelledby="cart-drawer-title"
				className={ cx(
					'absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-petrol shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none',
					isOpen ? 'translate-x-0' : 'translate-x-full'
				) }
			>
				<div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
					<h2 id="cart-drawer-title" className="font-display text-3xl uppercase tracking-wide text-cream">
						Your bag <span className="text-flame">({ count })</span>
					</h2>
					<button
						type="button"
						onClick={ onClose }
						aria-label="Close bag"
						className="grid h-11 w-11 place-items-center rounded-full bg-rust text-cream transition hover:bg-ember hover:text-midnight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame"
					>
						<Icon name="x" />
					</button>
				</div>

				{ isEmpty ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
						<span className="grid h-20 w-20 place-items-center rounded-full bg-navy text-flame">
							<Icon name="bag" className="h-9 w-9" />
						</span>
						<p className="font-display text-4xl uppercase text-cream">Your bag is empty</p>
						<p className="text-sm text-peach/80">Start with something bold — new arrivals land every week.</p>
						<Link
							href="/shop"
							onClick={ onClose }
							className="mt-2 inline-flex min-h-12 items-center rounded-md bg-rust px-6 text-sm font-bold uppercase tracking-widest text-cream transition hover:bg-ember hover:text-midnight"
						>
							Start shopping
						</Link>
					</div>
				) : (
					<>
						<div className="px-5 pt-4">
							<p className="text-xs font-semibold text-peach/80">
								{ remaining > 0
									? `Add ${ formatPrice( remaining ) } more for free standard shipping`
									: 'You’ve unlocked free standard shipping' }
							</p>
							<div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy">
								<div className={ cx( 'h-full rounded-full bg-ember transition-all duration-500 motion-reduce:transition-none', progressWidth ) } />
							</div>
						</div>

						<ul className={ cx( 'flex-1 divide-y divide-white/10 overflow-y-auto px-5', updating && 'opacity-60' ) }>
							{ products.map( ( item ) => {

								const href = item.slug ? productHref( item.slug ) : '/shop';

								return (
									<li key={ item.cartKey } className="flex gap-4 py-4">
										<Link href={ href } onClick={ onClose } className="relative h-28 w-20 shrink-0 overflow-hidden rounded bg-ember">
											<Img src={ item.image?.sourceUrl ?? '' } alt={ item.image?.altText || item.name } sizes="80px" />
										</Link>

										<div className="flex min-w-0 flex-1 flex-col gap-1">
											<div className="flex items-start justify-between gap-2">
												<Link href={ href } onClick={ onClose } className="font-display text-lg uppercase leading-tight tracking-wide text-cream hover:text-flame">
													{ item.name }
												</Link>
												<span className="shrink-0 text-sm font-bold text-flame">{ item.totalPrice }</span>
											</div>

											<p className="text-xs text-peach/70">{ variationLabel( item ) }</p>
											<p className="text-xs text-peach/70">{ formatPrice( item.price ) } each</p>

											<div className="mt-auto flex items-center justify-between">
												<div className="flex items-center rounded-full ring-1 ring-peach/30" role="group" aria-label={ `Quantity for ${ item.name }` }>
													<button
														type="button"
														disabled={ updating }
														onClick={ () => ( item.qty > 1 ? setQuantity( item.cartKey, item.qty - 1 ) : removeItem( item.cartKey ) ) }
														aria-label="Decrease quantity"
														className="grid h-9 w-9 place-items-center text-cream hover:text-flame disabled:opacity-50"
													>
														<Icon name="minus" className="h-3.5 w-3.5" />
													</button>
													<span className="w-6 text-center text-sm font-bold text-cream">{ item.qty }</span>
													<button
														type="button"
														disabled={ updating || item.qty >= 10 }
														onClick={ () => setQuantity( item.cartKey, item.qty + 1 ) }
														aria-label="Increase quantity"
														className="grid h-9 w-9 place-items-center text-cream hover:text-flame disabled:opacity-50"
													>
														<Icon name="plus" className="h-3.5 w-3.5" />
													</button>
												</div>

												<button
													type="button"
													disabled={ updating }
													onClick={ () => removeItem( item.cartKey ) }
													className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold uppercase tracking-widest text-peach/70 transition-colors hover:text-flame disabled:opacity-50"
												>
													<Icon name="trash" className="h-4 w-4" />Remove
												</button>
											</div>
										</div>
									</li>
								);
							} ) }
						</ul>

						<div className="border-t border-white/10 bg-navy px-5 py-5">
							<div className="flex items-baseline justify-between">
								<span className="text-sm font-bold uppercase tracking-widest text-cream">Subtotal</span>
								<span className="font-display text-3xl tracking-wide text-flame">{ subtotal }</span>
							</div>
							<p className="mt-1 text-xs text-peach/70">Shipping, discounts and VAT calculated at checkout.</p>
							<div className="mt-4 grid grid-cols-2 gap-3">
								<Link
									href="/cart"
									onClick={ onClose }
									className="inline-flex min-h-12 items-center justify-center rounded-md text-sm font-bold uppercase tracking-widest text-cream ring-1 ring-peach/40 transition hover:bg-cream hover:text-midnight"
								>
									View cart
								</Link>
								<Link
									href="/checkout"
									onClick={ onClose }
									className="inline-flex min-h-12 items-center justify-center rounded-md bg-rust text-sm font-bold uppercase tracking-widest text-cream transition hover:bg-ember hover:text-midnight"
								>
									Checkout
								</Link>
							</div>
						</div>
					</>
				) }
			</aside>
		</div>
	);
};

export default CartDrawer;
