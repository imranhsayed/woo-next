import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

/**
 * Checkout error summary.
 *
 * Lists every validation problem with a link to the field it belongs to, and
 * takes focus when it appears so the shopper is told rather than left to find
 * the red text themselves.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx|null}
 */
const ErrorSummary = ( { errors } ) => {

	const ref = useRef( null );
	const entries = Object.entries( errors );

	useEffect( () => {

		if ( entries.length ) {
			ref.current?.focus();
		}
	}, [ entries.length ] );

	if ( ! entries.length ) {
		return null;
	}

	return (
		<div
			id="checkout-errors"
			ref={ ref }
			tabIndex={ -1 }
			role="alert"
			className="rounded-md bg-rust p-4 text-sm text-cream focus:outline-none focus:ring-4 focus:ring-flame"
		>
			<p className="font-bold">
				Please fix { entries.length } { 1 === entries.length ? 'issue' : 'issues' } before placing your order:
			</p>
			<ul className="mt-2 list-inside list-disc">
				{ entries.map( ( [ id, message ] ) => (
					<li key={ id }>
						<a href={ `#${ 'terms' === id ? 'checkout-terms' : id }` } className="underline underline-offset-2">{ message }</a>
					</li>
				) ) }
			</ul>
		</div>
	);
};

ErrorSummary.propTypes = {
	errors: PropTypes.object.isRequired,
};

export default ErrorSummary;
