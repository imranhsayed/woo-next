import PropTypes from 'prop-types';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import { formatPrice } from '../../utils/price';
import { variationLabel } from '../cart/CartLineItem';

/**
 * Order review panel.
 *
 * The lines being bought, the money, and the button that places the order.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const OrderReview = ( { products, totals, coupons = [], isBusy = false, buttonLabel } ) => (
	<aside className="lg:col-span-5" aria-labelledby="order-review-title">
		<div className="flex flex-col gap-5 rounded-md bg-petrol p-6 ring-1 ring-white/10 lg:sticky lg:top-28">
			<h2 id="order-review-title" className="font-display text-3xl uppercase text-cream">Your order</h2>

			<ul className="flex flex-col gap-4">
				{ products.map( ( item ) => (
					<li key={ item.cartKey } className="flex items-center gap-4">
						<span className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-ember">
							<Img src={ item.image?.sourceUrl ?? '' } alt="" sizes="64px" />
							<span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-cream text-xs font-bold text-midnight">
								{ item.qty }
							</span>
						</span>
						<span className="min-w-0 flex-1">
							<span className="block truncate font-semibold text-cream">{ item.name }</span>
							<span className="text-xs text-peach/70">{ variationLabel( item ) }</span>
						</span>
						<span className="font-semibold text-cream">{ item.totalPrice }</span>
					</li>
				) ) }
			</ul>

			<dl className="flex flex-col gap-2 border-t border-white/10 pt-4 text-sm">
				<div className="flex justify-between">
					<dt className="text-peach/80">Subtotal</dt>
					<dd className="text-cream">{ formatPrice( totals.subtotal ) }</dd>
				</div>

				{ coupons.map( ( coupon ) => (
					<div key={ coupon.code } className="flex justify-between">
						<dt className="text-peach/80">Discount ({ coupon.code })</dt>
						<dd className="text-flame">−{ formatPrice( coupon.discount ) }</dd>
					</div>
				) ) }

				<div className="flex justify-between">
					<dt className="text-peach/80">Shipping</dt>
					<dd className="text-cream">{ totals.shipping ? formatPrice( totals.shipping ) : 'Free' }</dd>
				</div>

				<div className="flex justify-between">
					<dt className="text-peach/80">VAT (21%, included)</dt>
					<dd className="text-peach/80">{ formatPrice( totals.vat ) }</dd>
				</div>

				<div className="mt-2 flex items-baseline justify-between border-t border-white/10 pt-4">
					<dt className="text-sm font-bold uppercase tracking-widest text-cream">Total</dt>
					<dd className="font-display text-4xl text-flame">{ formatPrice( totals.total ) }</dd>
				</div>
			</dl>

			<button
				type="submit"
				disabled={ isBusy }
				className="inline-flex min-h-14 items-center justify-center gap-3 rounded-md bg-rust px-6 text-base font-bold uppercase tracking-widest text-cream transition duration-200 hover:bg-ember hover:text-midnight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame disabled:cursor-wait disabled:opacity-80"
			>
				{ isBusy ? (
					<span className="animate-spin motion-reduce:animate-none">
						<Icon name="loader" />
					</span>
				) : null }
				{ buttonLabel }
			</button>

			<p className="flex items-center justify-center gap-2 text-center text-xs text-peach/70">
				<Icon name="lock" className="h-4 w-4" />Your details are sent over an encrypted connection
			</p>
		</div>
	</aside>
);

OrderReview.propTypes = {
	products: PropTypes.array.isRequired,
	totals: PropTypes.object.isRequired,
	coupons: PropTypes.array,
	isBusy: PropTypes.bool,
	buttonLabel: PropTypes.string.isRequired,
};

export default OrderReview;
