import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import Layout from "../src/components/Layout";
import Icon from "../src/components/ui/Icon";
import Img from "../src/components/ui/Img";
import { AppContext } from "../src/components/context/AppContext";
import { formatPrice } from "../src/utils/price";
import { shippingRateMeta } from "../src/constants/shipping";

/** Delivery promise shown per shipping method. */
const deliveryEstimate = ( shippingLines ) => {

	const line = shippingLines?.[ 0 ];

	if ( ! line ) {
		return 'No delivery required';
	}

	return shippingRateMeta( { id: `${ line.methodId }:0`, label: line.title } ).eta || line.title;
};

/**
 * Human-readable order status.
 *
 * WooCommerce's slugs are lowercase and hyphenated; the design shows them as
 * words.
 *
 * @param {string} status Order status slug.
 *
 * @return {string} Status label.
 */
const statusLabel = ( status ) => ( status ?? '' )
	.replace( /-/g, ' ' )
	.replace( /^./, ( character ) => character.toUpperCase() );

/**
 * Format an address as display lines.
 *
 * @param {Object} address REST address.
 *
 * @return {Array} Non-empty lines.
 */
const addressLines = ( address = {} ) => [
	`${ address.first_name ?? '' } ${ address.last_name ?? '' }`.trim(),
	address.company,
	address.address_1,
	address.address_2,
	`${ address.postcode ?? '' } ${ address.city ?? '' }`.trim(),
	address.state,
	address.country,
	address.phone,
].filter( ( line ) => line && String( line ).trim() );

/**
 * Order confirmation page.
 *
 * Reads the order through a server-side lookup, since a guest cannot read
 * their own order over GraphQL. The order key in the URL is what authorises
 * it — the same token WooCommerce's own order-received page uses.
 *
 * @return {jsx}
 */
export default function ThankYouPage() {

	const router = useRouter();
	const [ , setCart ] = useContext( AppContext );

	const [ order, setOrder ] = useState( null );
	const [ error, setError ] = useState( '' );
	const [ isLoading, setLoading ] = useState( true );

	const { order_id: orderId, key } = router.query;

	useEffect( () => {

		if ( ! router.isReady ) {
			return;
		}

		if ( ! orderId || ! key ) {
			setError( 'This confirmation link is incomplete.' );
			setLoading( false );

			return;
		}

		/**
		 * The cart became an order, so clear the local copy.
		 *
		 * The gateway path empties the WooCommerce cart as part of checkout and
		 * the card path clears it before leaving for Stripe; this just drops
		 * what the browser cached so the header badge is right immediately.
		 */
		try {
			localStorage.removeItem( 'woo-next-cart' );
		} catch ( storageError ) {
			// Storage may be unavailable; the next cart query corrects it.
		}

		setCart( null );

		fetch( `/api/order?id=${ encodeURIComponent( orderId ) }&key=${ encodeURIComponent( key ) }` )
			.then( async ( response ) => {

				const data = await response.json();

				if ( ! response.ok ) {
					throw new Error( data?.error ?? 'We could not load this order.' );
				}

				setOrder( data );
			} )
			.catch( ( requestError ) => setError( requestError.message ) )
			.finally( () => setLoading( false ) );
	}, [ router.isReady, orderId, key, setCart ] );

	if ( isLoading ) {
		return (
			<Layout title="Order confirmation — WooNext">
				<div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
					<div className="h-64 animate-pulse rounded-md bg-petrol" />
					<div className="mt-6 h-24 animate-pulse rounded-md bg-petrol" />
				</div>
			</Layout>
		);
	}

	if ( error || ! order ) {
		return (
			<Layout title="Order not found — WooNext">
				<div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
					<h1 className="font-display text-5xl uppercase text-cream">Order not found</h1>
					<p className="text-sm text-peach/80">{ error }</p>
					<Link href="/shop" className="mt-2 inline-flex min-h-12 items-center rounded-md bg-rust px-6 text-sm font-bold uppercase tracking-widest text-cream hover:bg-ember hover:text-midnight">
						Continue shopping
					</Link>
				</div>
			</Layout>
		);
	}

	const facts = [
		{ label: 'Order number', value: `#${ order.number }` },
		{ label: 'Date', value: new Date( order.date ).toLocaleDateString( 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' } ) },
		{ label: 'Payment', value: order.paymentMethodTitle || '—' },
		{ label: 'Status', value: statusLabel( order.status ) },
		{ label: 'Total', value: formatPrice( order.totals.total ) },
	];

	return (
		<Layout title={ `Order #${ order.number } confirmed — WooNext` }>
			<div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center gap-4 rounded-md bg-gradient-to-br from-rust via-ember to-rust px-6 py-14 text-center">
					<span className="grid h-16 w-16 place-items-center rounded-full bg-cream text-rust">
						<Icon name="check" className="h-8 w-8" strokeWidth={ 2.5 } />
					</span>
					<p className="font-script text-4xl text-cream">Thank you, { order.billing?.first_name || 'friend' }!</p>
					<h1 className="font-display text-5xl uppercase leading-none text-midnight sm:text-7xl">Your order is confirmed</h1>
					<p className="max-w-lg text-sm font-semibold text-midnight">
						A confirmation is on its way to { order.billing?.email }.
					</p>
				</div>

				<dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-white/10 lg:grid-cols-5">
					{ facts.map( ( fact ) => (
						<div key={ fact.label } className="bg-petrol p-4">
							<dt className="text-xs font-bold uppercase tracking-widest text-peach/70">{ fact.label }</dt>
							<dd className="mt-1 font-display text-xl tracking-wide text-cream">{ fact.value }</dd>
						</div>
					) ) }
				</dl>

				<div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
					<section className="lg:col-span-7" aria-labelledby="order-items-title">
						<h2 id="order-items-title" className="font-display text-3xl uppercase text-cream">Items</h2>

						<ul className="mt-4 divide-y divide-white/10 rounded-md bg-petrol px-5 ring-1 ring-white/10">
							{ order.items.map( ( item ) => (
								<li key={ item.id } className="flex items-center gap-4 py-4">
									<span className="relative h-20 w-16 shrink-0 overflow-hidden rounded bg-ember">
										<Img src={ item.image } alt="" sizes="64px" />
									</span>
									<span className="flex-1">
										<span className="block font-semibold text-cream">{ item.name } × { item.quantity }</span>
										{ item.meta.length ? (
											<span className="text-xs text-peach/70">
												{ item.meta.map( ( meta ) => `${ meta.label }: ${ meta.value }` ).join( ' · ' ) }
											</span>
										) : null }
									</span>
									<span className="font-semibold text-cream">{ formatPrice( item.total ) }</span>
								</li>
							) ) }
						</ul>

						<dl className="mt-4 flex flex-col gap-2 text-sm">
							<div className="flex justify-between">
								<dt className="text-peach/80">Subtotal</dt>
								<dd className="text-cream">{ formatPrice( order.totals.subtotal ) }</dd>
							</div>
							{ order.coupons.map( ( coupon ) => (
								<div key={ coupon.code } className="flex justify-between">
									<dt className="text-peach/80">Discount ({ coupon.code })</dt>
									<dd className="text-flame">−{ formatPrice( coupon.discount ) }</dd>
								</div>
							) ) }
							<div className="flex justify-between">
								<dt className="text-peach/80">Shipping</dt>
								<dd className="text-cream">{ order.totals.shipping ? formatPrice( order.totals.shipping ) : 'Free' }</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-peach/80">VAT (21%, included)</dt>
								<dd className="text-peach/80">{ formatPrice( order.totals.vat ) }</dd>
							</div>
							<div className="mt-2 flex items-baseline justify-between border-t border-white/10 pt-4">
								<dt className="text-sm font-bold uppercase tracking-widest text-cream">Total</dt>
								<dd className="font-display text-3xl text-flame">{ formatPrice( order.totals.total ) }</dd>
							</div>
						</dl>
					</section>

					<section className="flex flex-col gap-4 lg:col-span-5" aria-label="Addresses and delivery">
						<div className="rounded-md bg-navy p-5 ring-1 ring-white/10">
							<p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-flame">
								<Icon name="truck" className="h-4 w-4" />Estimated delivery
							</p>
							<p className="mt-1 font-display text-2xl uppercase text-cream">{ deliveryEstimate( order.shippingLines ) }</p>
						</div>

						{ 'bacs' === order.paymentMethod ? (
							<div className="rounded-md bg-petrol p-5 text-sm ring-1 ring-white/10">
								<p className="text-xs font-bold uppercase tracking-widest text-peach/70">Paying by bank transfer</p>
								<p className="mt-2 text-peach/85">
									Use <strong className="text-cream">#{ order.number }</strong> as the payment reference. Your order ships once the funds clear.
								</p>
							</div>
						) : null }

						{ order.customerNote ? (
							<div className="rounded-md bg-petrol p-5 text-sm ring-1 ring-white/10">
								<p className="text-xs font-bold uppercase tracking-widest text-peach/70">Your note</p>
								<p className="mt-2 text-peach/85">{ order.customerNote }</p>
							</div>
						) : null }

						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
							<div className="rounded-md bg-petrol p-5 ring-1 ring-white/10">
								<h3 className="text-xs font-bold uppercase tracking-widest text-peach/70">Billing</h3>
								<address className="mt-2 text-sm not-italic leading-relaxed text-cream">
									{ addressLines( order.billing ).map( ( line ) => <span key={ line } className="block">{ line }</span> ) }
								</address>
							</div>
							<div className="rounded-md bg-petrol p-5 ring-1 ring-white/10">
								<h3 className="text-xs font-bold uppercase tracking-widest text-peach/70">Shipping</h3>
								<address className="mt-2 text-sm not-italic leading-relaxed text-cream">
									{ addressLines( order.shipping ).map( ( line ) => <span key={ line } className="block">{ line }</span> ) }
								</address>
							</div>
						</div>

						<div className="flex flex-wrap gap-3">
							<Link href="/page/track-order" className="inline-flex min-h-12 items-center rounded-md bg-rust px-5 text-sm font-bold uppercase tracking-widest text-cream hover:bg-ember hover:text-midnight">
								Track order
							</Link>
							<Link href="/shop" className="inline-flex min-h-12 items-center px-2 text-sm font-bold uppercase tracking-widest text-flame hover:underline">
								Continue shopping
							</Link>
						</div>
					</section>
				</div>
			</div>
		</Layout>
	);
}
