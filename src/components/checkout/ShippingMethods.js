import PropTypes from 'prop-types';
import cx from 'classnames';

import { formatPrice } from '../../utils/price';
import { shippingRateMeta } from '../../constants/shipping';

/**
 * Shipping method chooser.
 *
 * The rates come from WooCommerce for the address on the session, so changing
 * the delivery country updates what appears here.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const ShippingMethods = ( { rates, value, country, disabled = false, onChange } ) => {

	if ( ! rates.length ) {
		return (
			<p className="rounded-md bg-petrol p-4 text-sm font-semibold text-flame ring-1 ring-flame/40">
				We don’t deliver to that country yet — pick another destination to see delivery options.
			</p>
		);
	}

	return (
		<div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Shipping method">
			{ rates.map( ( rate ) => {

				const meta = shippingRateMeta( rate, country );
				const isChosen = value === rate.id;

				return (
					<label
						key={ rate.id }
						className={ cx(
							'flex cursor-pointer flex-col gap-1 rounded-md p-4 ring-1 transition duration-200',
							isChosen ? 'bg-navy ring-ember' : 'bg-petrol ring-white/10 hover:ring-peach/40'
						) }
					>
						<span className="flex items-center gap-2">
							<input
								type="radio"
								name="checkout-shipping"
								checked={ isChosen }
								onChange={ () => onChange( rate.id ) }
								disabled={ disabled }
								className="h-5 w-5 border-peach/40 bg-transparent text-ember focus:ring-flame focus:ring-offset-0"
							/>
							<span className="font-bold text-cream">{ meta.label }</span>
						</span>
						<span className="text-xs text-peach/70">{ meta.eta }</span>
						<span className="font-display text-xl text-flame">{ rate.cost ? formatPrice( rate.cost ) : 'Free' }</span>
					</label>
				);
			} ) }
		</div>
	);
};

ShippingMethods.propTypes = {
	rates: PropTypes.array.isRequired,
	value: PropTypes.string,
	country: PropTypes.string,
	disabled: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
};

export default ShippingMethods;
