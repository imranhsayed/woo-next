import Link from 'next/link';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from '../ui/Icon';
import { formatPrice } from '../../utils/price';
import { SHIPPING_COUNTRIES, shippingRateMeta } from '../../constants/shipping';

/**
 * Cart order summary.
 *
 * Delivery country and rate chooser, then the money: subtotal, any discount,
 * shipping, the VAT already inside the total, and the total itself.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const OrderSummary = ( {
	totals,
	coupons = [],
	shippingRates = [],
	chosenShippingMethod = '',
	country = 'ES',
	needsShippingAddress = false,
	isDirty = false,
	isBusy = false,
	onCountryChange,
	onShippingMethodChange,
	onRemoveCoupon,
} ) => {

	return (
		<aside className="lg:col-span-4" aria-labelledby="summary-title">
			<div className="flex flex-col gap-5 rounded-md bg-petrol p-6 ring-1 ring-white/10 lg:sticky lg:top-28">
				<h2 id="summary-title" className="font-display text-3xl uppercase text-cream">Order summary</h2>

				{ needsShippingAddress ? (
					<fieldset className="flex flex-col gap-3">
						<legend className="mb-2 text-xs font-bold uppercase tracking-widest text-cream">Shipping estimate</legend>

						<label htmlFor="ship-country" className="sr-only">Country</label>
						<select
							id="ship-country"
							value={ country }
							onChange={ ( event ) => onCountryChange( event.target.value ) }
							disabled={ isBusy }
							className="min-h-11 rounded-md border-0 bg-navy text-sm text-cream ring-1 ring-peach/30 focus:ring-2 focus:ring-flame"
						>
							{ SHIPPING_COUNTRIES.map( ( item ) => (
								<option key={ item.code } value={ item.code }>{ item.name }</option>
							) ) }
						</select>

						{ shippingRates.length ? shippingRates.map( ( rate ) => {

							const meta = shippingRateMeta( rate, country );
							const isChosen = chosenShippingMethod === rate.id;

							return (
								<label
									key={ rate.id }
									className={ cx(
										'flex cursor-pointer items-center gap-3 rounded-md p-3 text-sm ring-1 transition',
										isChosen ? 'bg-navy ring-ember' : 'ring-white/10 hover:ring-peach/40'
									) }
								>
									<input
										type="radio"
										name="cart-shipping"
										checked={ isChosen }
										onChange={ () => onShippingMethodChange( rate.id ) }
										disabled={ isBusy }
										className="h-5 w-5 border-peach/40 bg-transparent text-ember focus:ring-flame focus:ring-offset-0"
									/>
									<span className="flex-1">
										<span className="block font-semibold text-cream">{ meta.label }</span>
										<span className="text-xs text-peach/70">{ meta.eta }</span>
									</span>
									<span className="font-bold text-cream">{ rate.cost ? formatPrice( rate.cost ) : 'Free' }</span>
								</label>
							);
						} ) : (
							<p className="rounded-md bg-navy p-3 text-xs font-semibold text-flame">
								We don’t ship to that country yet — try another destination.
							</p>
						) }
					</fieldset>
				) : null }

				<dl className="flex flex-col gap-2 border-t border-white/10 pt-4 text-sm">
					<div className="flex justify-between">
						<dt className="text-peach/80">Subtotal</dt>
						<dd className="font-semibold text-cream">{ formatPrice( totals.subtotal ) }</dd>
					</div>

					{ coupons.map( ( coupon ) => (
						<div key={ coupon.code } className="flex justify-between">
							<dt className="text-peach/80">
								Discount <span className="rounded bg-ember px-1.5 py-0.5 text-xs font-bold text-midnight">{ coupon.code }</span>
								<button
									type="button"
									onClick={ () => onRemoveCoupon( coupon.code ) }
									disabled={ isBusy }
									className="ml-1 text-xs underline hover:text-flame disabled:opacity-50"
								>
									Remove
								</button>
							</dt>
							<dd className="font-semibold text-flame">−{ formatPrice( coupon.discount ) }</dd>
						</div>
					) ) }

					<div className="flex justify-between">
						<dt className="text-peach/80">Shipping</dt>
						<dd className="font-semibold text-cream">{ totals.shipping ? formatPrice( totals.shipping ) : 'Free' }</dd>
					</div>

					<div className="flex justify-between">
						<dt className="text-peach/80">VAT (21%, included)</dt>
						<dd className="text-peach/80">{ formatPrice( totals.vat ) }</dd>
					</div>

					<div className="mt-2 flex items-baseline justify-between border-t border-white/10 pt-4">
						<dt className="text-sm font-bold uppercase tracking-widest text-cream">Total</dt>
						<dd className="font-display text-4xl tracking-wide text-flame">{ formatPrice( totals.total ) }</dd>
					</div>
				</dl>

				{ isDirty ? (
					<p role="status" className="rounded-md bg-navy p-3 text-xs font-semibold text-flame">
						You changed quantities — press “Update cart” to recalculate.
					</p>
				) : null }

				<Link
					href="/checkout"
					className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-md bg-rust px-6 text-sm font-bold uppercase tracking-widest text-cream transition hover:bg-ember hover:text-midnight"
				>
					Proceed to checkout
					<span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
						<Icon name="arrow-right" className="h-4 w-4" />
					</span>
				</Link>

				<p className="flex items-center justify-center gap-2 text-xs text-peach/70">
					<Icon name="lock" className="h-4 w-4" />Secure checkout — your details stay encrypted
				</p>
			</div>
		</aside>
	);
};

OrderSummary.propTypes = {
	totals: PropTypes.object.isRequired,
	coupons: PropTypes.array,
	shippingRates: PropTypes.array,
	chosenShippingMethod: PropTypes.string,
	country: PropTypes.string,
	needsShippingAddress: PropTypes.bool,
	isDirty: PropTypes.bool,
	isBusy: PropTypes.bool,
	onCountryChange: PropTypes.func.isRequired,
	onShippingMethodChange: PropTypes.func.isRequired,
	onRemoveCoupon: PropTypes.func.isRequired,
};

export default OrderSummary;
