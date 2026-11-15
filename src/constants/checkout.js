/**
 * Checkout form definition and payment presentation.
 *
 * Field order, labels and autocomplete hints come from the design. Which
 * payment methods exist is WooCommerce's decision — what lives here is only
 * how each one is described.
 */

/** Contact and billing fields, in the order the design lays them out. */
export const BILLING_FIELDS = [
	{ name: 'email',     label: 'Email address',      type: 'email', autoComplete: 'email',          span: 'sm:col-span-2', required: true },
	{ name: 'firstName', label: 'First name',         type: 'text',  autoComplete: 'given-name',     span: '',              required: true },
	{ name: 'lastName',  label: 'Last name',          type: 'text',  autoComplete: 'family-name',    span: '',              required: true },
	{ name: 'company',   label: 'Company (optional)', type: 'text',  autoComplete: 'organization',   span: 'sm:col-span-2', required: false },
	{ name: 'address1',  label: 'Street address',     type: 'text',  autoComplete: 'street-address', span: 'sm:col-span-2', required: true },
	{ name: 'city',      label: 'City',               type: 'text',  autoComplete: 'address-level2', span: '',              required: true },
	{ name: 'postcode',  label: 'Postcode',           type: 'text',  autoComplete: 'postal-code',    span: '',              required: true },
	{ name: 'country',   label: 'Country',            type: 'select', autoComplete: 'country',       span: '',              required: true },
	{ name: 'state',     label: 'State / Province',   type: 'select', autoComplete: 'address-level1', span: '',             required: false },
	{ name: 'phone',     label: 'Phone',              type: 'tel',   autoComplete: 'tel',            span: '',              required: true },
];

/** Shipping fields, shown when delivering to a different address. */
export const SHIPPING_FIELDS = [
	{ name: 'firstName', label: 'First name',       type: 'text',  autoComplete: 'given-name',     span: '',              required: true },
	{ name: 'lastName',  label: 'Last name',        type: 'text',  autoComplete: 'family-name',    span: '',              required: true },
	{ name: 'address1',  label: 'Street address',   type: 'text',  autoComplete: 'street-address', span: 'sm:col-span-2', required: true },
	{ name: 'city',      label: 'City',             type: 'text',  autoComplete: 'address-level2', span: '',              required: true },
	{ name: 'postcode',  label: 'Postcode',         type: 'text',  autoComplete: 'postal-code',    span: '',              required: true },
	{ name: 'country',   label: 'Country',          type: 'select', autoComplete: 'country',       span: '',              required: true },
	{ name: 'state',     label: 'State / Province', type: 'select', autoComplete: 'address-level1', span: '',              required: false },
];

/** An empty address, used as the form's starting state. */
export const emptyAddress = ( extra = {} ) => ( {
	firstName: '',
	lastName: '',
	company: '',
	address1: '',
	city: '',
	postcode: '',
	country: 'DE',
	state: '',
	phone: '',
	email: '',
	...extra,
} );

/**
 * How each payment method is described.
 *
 * `stripe` is this storefront's own card option, handled by the Stripe
 * Checkout flow rather than a WooCommerce gateway; the rest are WooCommerce
 * gateway ids and are presented in this order.
 */
export const PAYMENT_METHODS = [
	{
		id: 'stripe',
		title: 'Card',
		note: 'You’ll be taken to Stripe’s secure payment page to enter your card details, then returned here.',
		isStripe: true,
	},
	{
		id: 'bacs',
		title: 'Direct bank transfer',
		note: 'Make your payment directly into our bank account using your order number as the reference. Your order ships once the funds clear, so it will sit on hold until then.',
	},
	{
		id: 'cod',
		title: 'Cash on delivery',
		note: 'Pay with cash when your order is delivered.',
	},
];

/** The method selected when the page opens. */
export const DEFAULT_PAYMENT_METHOD = 'stripe';
