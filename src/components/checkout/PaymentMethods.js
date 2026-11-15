import PropTypes from 'prop-types';
import cx from 'classnames';

/**
 * Payment method chooser.
 *
 * Only methods WooCommerce actually offers are listed, plus the storefront's
 * own Stripe card option. The selected method explains itself underneath.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const PaymentMethods = ( { methods, value, onChange } ) => (
	<fieldset className="flex flex-col gap-3">
		<legend className="mb-4 font-display text-3xl uppercase text-cream">3 · Payment</legend>

		{ methods.map( ( method ) => {

			const isChosen = value === method.id;

			return (
				<label
					key={ method.id }
					className={ cx(
						'flex cursor-pointer flex-col gap-2 rounded-md p-4 ring-1 transition duration-200',
						isChosen ? 'bg-navy ring-ember' : 'bg-petrol ring-white/10 hover:ring-peach/40'
					) }
				>
					<span className="flex items-center gap-3">
						<input
							type="radio"
							name="checkout-payment"
							checked={ isChosen }
							onChange={ () => onChange( method.id ) }
							className="h-5 w-5 border-peach/40 bg-transparent text-ember focus:ring-flame focus:ring-offset-0"
						/>
						<span className="font-bold text-cream">{ method.title }</span>
					</span>
					{ isChosen ? <span className="pl-8 text-sm text-peach/80">{ method.note }</span> : null }
				</label>
			);
		} ) }
	</fieldset>
);

PaymentMethods.propTypes = {
	methods: PropTypes.array.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default PaymentMethods;
