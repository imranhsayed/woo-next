import PropTypes from 'prop-types';
import { useState } from 'react';
import cx from 'classnames';

/**
 * Coupon entry.
 *
 * WooCommerce validates the code, so the form only reports what it says back —
 * including the minimum-spend message, which arrives as HTML and is flattened
 * to text before it gets here.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const CouponForm = ( { onApply, disabled = false } ) => {

	const [ code, setCode ] = useState( '' );
	const [ message, setMessage ] = useState( '' );
	const [ isOk, setOk ] = useState( false );

	const onSubmit = async ( event ) => {

		event.preventDefault();

		const trimmed = code.trim().toUpperCase();

		if ( ! trimmed ) {
			setOk( false );
			setMessage( 'Enter a coupon code first.' );
			return;
		}

		const result = await onApply( trimmed );

		setOk( result.ok );
		setMessage( result.ok ? `${ trimmed } applied.` : result.message );

		if ( result.ok ) {
			setCode( '' );
		}
	};

	return (
		<form onSubmit={ onSubmit } noValidate className="flex w-full max-w-md flex-col gap-2">
			<label htmlFor="coupon" className="text-xs font-bold uppercase tracking-widest text-cream">Coupon code</label>
			<div className="flex gap-2">
				<input
					id="coupon"
					value={ code }
					onChange={ ( event ) => {
						setCode( event.target.value );
						setMessage( '' );
					} }
					aria-invalid={ ! isOk && message ? 'true' : 'false' }
					aria-describedby="coupon-msg"
					placeholder="e.g. WOONEXT10"
					className="min-h-12 flex-1 rounded-md border-0 bg-petrol px-4 font-semibold uppercase tracking-wider text-cream ring-1 ring-peach/30 placeholder-peach/40 focus:ring-2 focus:ring-flame"
				/>
				<button
					type="submit"
					disabled={ disabled }
					className="min-h-12 rounded-md bg-cream px-5 text-sm font-bold uppercase tracking-widest text-midnight transition hover:bg-peach disabled:opacity-60"
				>
					Apply
				</button>
			</div>
			<p id="coupon-msg" aria-live="polite" className={ cx( 'min-h-5 text-sm font-semibold', isOk ? 'text-emerald-300' : 'text-flame' ) }>
				{ message }
			</p>
			<p className="text-xs text-peach/60">Try: WOONEXT10 · RETRO25 (over 150 €) · FREESHIP</p>
		</form>
	);
};

CouponForm.propTypes = {
	onApply: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};

export default CouponForm;
