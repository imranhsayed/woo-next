import { BILLING_FIELDS, SHIPPING_FIELDS } from '../constants/checkout';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTCODE_PATTERN = /^[A-Za-z0-9 -]{3,10}$/;
const PHONE_PATTERN = /^[+0-9 ()-]{6,}$/;

/**
 * Validate the checkout form.
 *
 * Returns one message per problem, keyed by the field's DOM id so the error
 * summary can link straight to it.
 *
 * @param {Object}  values            `{ billing, shipping, shipToDifferent, acceptedTerms }`.
 * @param {boolean} requiresShipping  Whether the order needs a delivery address.
 * @param {boolean} requiresState     Whether the chosen country has states to
 *                                    pick from, which makes the field required.
 *
 * @return {Object} Field id to message.
 */
export const validateCheckout = ( { billing, shipping, shipToDifferent, acceptedTerms }, requiresShipping = true, requiresState = false ) => {

	const errors = {};

	BILLING_FIELDS.forEach( ( field ) => {

		if ( field.required && ! String( billing[ field.name ] ?? '' ).trim() ) {
			errors[ `billing-${ field.name }` ] = `${ field.label } is required`;
		}
	} );

	if ( billing.email && ! EMAIL_PATTERN.test( billing.email ) ) {
		errors[ 'billing-email' ] = 'Enter a valid email, like name@example.com';
	}

	if ( billing.postcode && ! POSTCODE_PATTERN.test( billing.postcode ) ) {
		errors[ 'billing-postcode' ] = 'Enter a valid postcode';
	}

	if ( billing.phone && ! PHONE_PATTERN.test( billing.phone ) ) {
		errors[ 'billing-phone' ] = 'Enter a valid phone number';
	}

	/**
	 * State is only a real field for countries WooCommerce divides into states,
	 * and it is hidden for the rest — so it is required exactly when shown.
	 */
	const stateGroup = requiresShipping && shipToDifferent ? 'shipping' : 'billing';
	const stateValue = 'shipping' === stateGroup ? shipping.state : billing.state;

	if ( requiresState && ! String( stateValue ?? '' ).trim() ) {
		errors[ `${ stateGroup }-state` ] = 'Select a state or province';
	}

	// A separate delivery address only matters for an order that ships.
	if ( requiresShipping && shipToDifferent ) {

		SHIPPING_FIELDS.forEach( ( field ) => {

			if ( field.required && ! String( shipping[ field.name ] ?? '' ).trim() ) {
				errors[ `shipping-${ field.name }` ] = `Shipping ${ field.label.toLowerCase() } is required`;
			}
		} );

		if ( shipping.postcode && ! POSTCODE_PATTERN.test( shipping.postcode ) ) {
			errors[ 'shipping-postcode' ] = 'Enter a valid shipping postcode';
		}
	}

	if ( ! acceptedTerms ) {
		errors.terms = 'You must accept the terms to place your order';
	}

	return errors;
};

export default validateCheckout;
