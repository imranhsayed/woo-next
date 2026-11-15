import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";

import Layout from "../src/components/Layout";
import Icon from "../src/components/ui/Icon";
import CheckoutField from "../src/components/checkout/CheckoutField";
import ErrorSummary from "../src/components/checkout/ErrorSummary";
import PaymentMethods from "../src/components/checkout/PaymentMethods";
import ShippingMethods from "../src/components/checkout/ShippingMethods";
import OrderReview from "../src/components/checkout/OrderReview";
import CouponForm from "../src/components/cart/CouponForm";

import useCart from "../src/hooks/useCart";
import usePlaceOrder from "../src/hooks/usePlaceOrder";
import validateCheckout from "../src/validator/checkout-form";
import GET_COUNTRIES from "../src/queries/get-countries";
import GET_STATES from "../src/queries/get-states";
import GET_PAYMENT_GATEWAYS from "../src/queries/get-payment-gateways";
import {
	BILLING_FIELDS,
	DEFAULT_PAYMENT_METHOD,
	PAYMENT_METHODS,
	SHIPPING_FIELDS,
	emptyAddress,
} from "../src/constants/checkout";

/**
 * Checkout page.
 *
 * Collects contact and billing details, an optional separate delivery address,
 * the shipping and payment choice, then hands off to `usePlaceOrder`.
 *
 * @return {jsx}
 */
export default function CheckoutPage() {

	const {
		products, totals, coupons, shippingRates, chosenShippingMethod,
		needsShippingAddress, isEmpty, loading, updating,
		applyCoupon, setShippingMethod, setShippingCountry,
	} = useCart();

	const { placeOrder, isPlacing, error: orderError } = usePlaceOrder();

	const [ billing, setBilling ] = useState( () => emptyAddress( { email: '' } ) );
	const [ shipping, setShipping ] = useState( () => emptyAddress() );
	const [ shipToDifferent, setShipToDifferent ] = useState( false );
	const [ paymentMethod, setPaymentMethod ] = useState( DEFAULT_PAYMENT_METHOD );
	const [ customerNote, setCustomerNote ] = useState( '' );
	const [ acceptedTerms, setAcceptedTerms ] = useState( false );
	const [ hasSubmitted, setSubmitted ] = useState( false );

	const { data: countryData } = useQuery( GET_COUNTRIES );
	const { data: gatewayData } = useQuery( GET_PAYMENT_GATEWAYS );

	const countries = ( countryData?.wooCountries?.billingCountries ?? [] )
		.map( ( item ) => ( { code: item.countryCode, name: item.countryName } ) );

	// The delivery address decides which states list is needed.
	const stateCountry = shipToDifferent ? shipping.country : billing.country;

	const { data: stateData } = useQuery( GET_STATES, {
		variables: { countryCode: stateCountry || '' },
		skip: ! stateCountry,
	} );

	const states = ( stateData?.wooStates?.states ?? [] )
		.map( ( item ) => ( { code: item.stateCode, name: item.stateName } ) );

	/**
	 * Payment methods WooCommerce actually offers, plus the card option.
	 *
	 * Stripe is this storefront's own integration rather than a WooCommerce
	 * gateway, so it is always available; the rest are filtered against what
	 * the store has enabled, so a disabled gateway can never be selected.
	 */
	const methods = useMemo( () => {

		const enabled = ( gatewayData?.paymentGateways?.nodes ?? [] ).map( ( node ) => node.id );

		return PAYMENT_METHODS.filter( ( method ) => method.isStripe || enabled.includes( method.id ) );
	}, [ gatewayData ] );

	// Fall back to an available method if the default is not offered.
	useEffect( () => {

		if ( methods.length && ! methods.some( ( method ) => method.id === paymentMethod ) ) {
			setPaymentMethod( methods[ 0 ].id );
		}
	}, [ methods, paymentMethod ] );

	/**
	 * Keep the session's delivery country in step with the form.
	 *
	 * Shipping rates are calculated for the address WooCommerce holds, so the
	 * options and cost only match the form once it has been told.
	 */
	useEffect( () => {

		if ( stateCountry ) {
			setShippingCountry( stateCountry );
		}
	}, [ stateCountry ] ); // eslint-disable-line react-hooks/exhaustive-deps

	const errors = hasSubmitted
		? validateCheckout( { billing, shipping, shipToDifferent, acceptedTerms }, needsShippingAddress, states.length > 0 )
		: {};

	/**
	 * Apply a field change.
	 *
	 * Changing country clears the state: the codes are country-specific, so a
	 * state left over from the previous country would be rejected.
	 *
	 * @param {Function} setter Address setter.
	 *
	 * @return {Function} Change handler.
	 */
	const addressChanger = ( setter ) => ( name, value ) => setter( ( current ) => ( {
		...current,
		[ name ]: value,
		...( 'country' === name ? { state: '' } : {} ),
	} ) );

	const onBillingChange = addressChanger( setBilling );
	const onShippingChange = addressChanger( setShipping );

	/**
	 * Drop the state select for countries WooCommerce has no states for, and
	 * require it for the countries that do.
	 */
	const visibleFields = ( fields ) => fields
		.filter( ( field ) => 'state' !== field.name || states.length )
		.map( ( field ) => ( 'state' === field.name ? { ...field, required: true } : field ) );

	const chosenRate = shippingRates.find( ( rate ) => rate.id === chosenShippingMethod );

	const onSubmit = async ( event ) => {

		event.preventDefault();
		setSubmitted( true );

		const found = validateCheckout( { billing, shipping, shipToDifferent, acceptedTerms }, needsShippingAddress, states.length > 0 );

		if ( Object.keys( found ).length ) {
			return;
		}

		await placeOrder(
			{
				billing,
				shipping,
				shipToDifferent,
				paymentMethod,
				paymentMethodTitle: methods.find( ( method ) => method.id === paymentMethod )?.title ?? 'Card',
				customerNote,
				shippingLine: chosenRate
					? { methodId: chosenRate.id.split( ':' )[ 0 ], title: chosenRate.label, total: chosenRate.cost }
					: null,
				coupons: coupons.map( ( coupon ) => coupon.code ),
			},
			products,
			totals ?? { total: 0 }
		);
	};

	const buttonLabel = 'stripe' === paymentMethod ? 'Continue to payment' : 'Place order';

	return (
		<Layout title="Checkout — WooNext">
			<div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
				<nav aria-label="Checkout progress">
					<ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-peach/70">
						<li><Link href="/cart" className="hover:text-flame">Cart</Link></li>
						<li aria-hidden="true">/</li>
						<li aria-current="step" className="text-cream">Checkout</li>
						<li aria-hidden="true">/</li>
						<li>Confirmation</li>
					</ol>
				</nav>

				<h1 className="mt-4 font-display text-6xl uppercase leading-none text-cream sm:text-7xl">Checkout</h1>
				<p className="mt-2 flex items-center gap-2 text-sm text-peach/80">
					<Icon name="info" className="h-4 w-4 text-flame" />
					Card payments run through Stripe in test mode — no money is taken.
				</p>

				{ loading && isEmpty ? (
					<div className="mt-8 h-64 animate-pulse rounded-md bg-petrol" />
				) : isEmpty ? (
					<div className="mt-8 flex flex-col items-center gap-4 rounded-md bg-petrol px-6 py-16 text-center ring-1 ring-white/10">
						<h2 className="font-display text-4xl uppercase text-cream">There’s nothing to check out</h2>
						<p className="text-peach/80">Add something to your bag first.</p>
						<Link href="/shop" className="inline-flex min-h-12 items-center rounded-md bg-rust px-6 text-sm font-bold uppercase tracking-widest text-cream hover:bg-ember hover:text-midnight">
							Go shopping
						</Link>
					</div>
				) : (
					<form onSubmit={ onSubmit } noValidate className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12" aria-describedby="checkout-errors">
						<div className="flex flex-col gap-8 lg:col-span-7">
							<ErrorSummary errors={ errors } />

							{ orderError ? (
								<div role="alert" className="flex items-start gap-3 rounded-md bg-rust p-4 text-sm text-cream">
									<Icon name="alert" />
									<p><strong className="block">We couldn’t place your order.</strong>{ orderError }</p>
								</div>
							) : null }

							<fieldset className="flex flex-col gap-4">
								<legend className="mb-4 font-display text-3xl uppercase text-cream">1 · Contact &amp; billing</legend>
								<div className="grid gap-4 sm:grid-cols-2">
									{ visibleFields( BILLING_FIELDS ).map( ( field ) => (
										<CheckoutField
											key={ field.name }
											field={ field }
											group="billing"
											value={ billing[ field.name ] ?? '' }
											error={ errors[ `billing-${ field.name }` ] ?? '' }
											options={ 'country' === field.name ? countries : 'state' === field.name ? states : [] }
											onChange={ onBillingChange }
										/>
									) ) }
								</div>
							</fieldset>

							{ needsShippingAddress ? (
								<fieldset className="flex flex-col gap-4">
									<legend className="mb-4 font-display text-3xl uppercase text-cream">2 · Shipping</legend>

									<label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-peach">
										<input
											type="checkbox"
											checked={ shipToDifferent }
											onChange={ () => setShipToDifferent( ( value ) => ! value ) }
											className="h-5 w-5 rounded border-peach/40 bg-transparent text-ember focus:ring-flame focus:ring-offset-0"
										/>
										Ship to a different address
									</label>

									{ shipToDifferent ? (
										<div className="grid gap-4 sm:grid-cols-2">
											{ visibleFields( SHIPPING_FIELDS ).map( ( field ) => (
												<CheckoutField
													key={ field.name }
													field={ field }
													group="shipping"
													value={ shipping[ field.name ] ?? '' }
													error={ errors[ `shipping-${ field.name }` ] ?? '' }
													options={ 'country' === field.name ? countries : 'state' === field.name ? states : [] }
													onChange={ onShippingChange }
												/>
											) ) }
										</div>
									) : null }

									<ShippingMethods
										rates={ shippingRates }
										value={ chosenShippingMethod }
										country={ stateCountry }
										disabled={ updating }
										onChange={ setShippingMethod }
									/>
								</fieldset>
							) : null }

							<PaymentMethods methods={ methods } value={ paymentMethod } onChange={ setPaymentMethod } />

							<div className="grid gap-4 sm:grid-cols-2">
								<CouponForm onApply={ applyCoupon } disabled={ updating } />

								<div className="flex flex-col gap-1.5">
									<label htmlFor="checkout-notes" className="text-xs font-bold uppercase tracking-widest text-cream">
										Order notes <span className="font-normal normal-case tracking-normal text-peach/60">(optional)</span>
									</label>
									<textarea
										id="checkout-notes"
										rows={ 3 }
										value={ customerNote }
										onChange={ ( event ) => setCustomerNote( event.target.value ) }
										placeholder="Delivery instructions, gift message…"
										className="rounded-md border-0 bg-petrol px-4 py-3 text-cream ring-1 ring-peach/30 placeholder-peach/40 focus:ring-2 focus:ring-flame"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="flex cursor-pointer items-start gap-3 text-sm text-peach">
									<input
										id="checkout-terms"
										type="checkbox"
										checked={ acceptedTerms }
										onChange={ () => setAcceptedTerms( ( value ) => ! value ) }
										aria-invalid={ errors.terms ? 'true' : 'false' }
										aria-describedby={ errors.terms ? 'checkout-terms-error' : undefined }
										className="mt-0.5 h-5 w-5 rounded border-peach/40 bg-transparent text-ember focus:ring-flame focus:ring-offset-0"
									/>
									<span>
										I have read and agree to the <Link href="/page/terms" className="font-semibold text-flame underline">terms &amp; conditions</Link> and{ ' ' }
										<Link href="/page/privacy" className="font-semibold text-flame underline">privacy policy</Link>.
										<span className="text-flame" aria-hidden="true"> *</span>
									</span>
								</label>
								{ errors.terms ? (
									<p id="checkout-terms-error" className="pl-8 text-sm font-semibold text-flame">{ errors.terms }</p>
								) : null }
							</div>
						</div>

						<OrderReview
							products={ products }
							totals={ totals ?? { subtotal: 0, discount: 0, shipping: 0, vat: 0, total: 0 } }
							coupons={ coupons }
							isBusy={ isPlacing }
							buttonLabel={ buttonLabel }
						/>
					</form>
				) }
			</div>
		</Layout>
	);
}
