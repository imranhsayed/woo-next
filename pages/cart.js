import Link from "next/link";
import { useQuery } from "@apollo/client";
import { useState } from "react";

import Layout from "../src/components/Layout";
import Icon from "../src/components/ui/Icon";
import CartLineItem from "../src/components/cart/CartLineItem";
import CouponForm from "../src/components/cart/CouponForm";
import OrderSummary from "../src/components/cart/OrderSummary";
import useCart from "../src/hooks/useCart";
import { useUI } from "../src/components/context/UIContext";
import GET_CUSTOMER_COUNTRY from "../src/queries/get-customer-country";

/** WooCommerce caps a cart line at ten in this storefront. */
const MAX_QUANTITY = 10;

/**
 * Cart page.
 *
 * Quantity edits collect locally and apply together on "Update cart", matching
 * the prototype — one request instead of one per keystroke, and the shopper can
 * change their mind before committing.
 *
 * @return {jsx}
 */
export default function CartPage() {

	const { toast } = useUI();
	const {
		products, count, totals, coupons, shippingRates, chosenShippingMethod,
		needsShippingAddress, isEmpty, loading, updating, requestError,
		setQuantities, removeItem, applyCoupon, removeCoupon,
		setShippingMethod, setShippingCountry,
	} = useCart();

	/** Quantities the shopper has typed but not yet applied, keyed by cart key. */
	const [ pending, setPending ] = useState( {} );

	const { data: customer } = useQuery( GET_CUSTOMER_COUNTRY );
	const country = customer?.customer?.shipping?.country ?? 'ES';

	const quantityOf = ( item ) => ( undefined !== pending[ item.cartKey ] ? pending[ item.cartKey ] : item.qty );

	const dirtyKeys = products
		.filter( ( item ) => undefined !== pending[ item.cartKey ] && pending[ item.cartKey ] !== item.qty )
		.map( ( item ) => item.cartKey );

	const onQuantityChange = ( cartKey, value ) => {

		const quantity = Math.max( 1, Math.min( MAX_QUANTITY, parseInt( value, 10 ) || 1 ) );

		setPending( ( current ) => ( { ...current, [ cartKey ]: quantity } ) );
	};

	const onUpdateCart = async () => {

		const changes = Object.fromEntries( dirtyKeys.map( ( key ) => [ key, pending[ key ] ] ) );

		await setQuantities( changes );

		setPending( {} );
		toast( 'Cart updated — totals recalculated' );
	};

	const onRemove = async ( cartKey, name ) => {

		setPending( ( current ) => {
			const next = { ...current };
			delete next[ cartKey ];

			return next;
		} );

		await removeItem( cartKey );
		toast( `${ name } removed from your bag`, { tone: 'info' } );
	};

	return (
		<Layout title="Your bag — WooNext">
			<div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
				<nav aria-label="Breadcrumb">
					<ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-peach/70">
						<li><Link href="/" className="hover:text-flame">Home</Link></li>
						<li aria-hidden="true">/</li>
						<li aria-current="page" className="text-cream">Cart</li>
					</ol>
				</nav>

				<div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
					<h1 className="font-display text-6xl uppercase leading-none text-cream sm:text-7xl">
						Your bag <span className="text-flame">({ count })</span>
					</h1>
					<Link href="/shop" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-peach hover:text-flame">
						<span className="transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transform-none">
							<Icon name="arrow-left" className="h-4 w-4" />
						</span>
						Continue shopping
					</Link>
				</div>

				{ requestError ? (
					<p role="alert" className="mt-6 rounded-md bg-petrol p-4 text-sm font-semibold text-flame ring-1 ring-flame/40">
						{ requestError }
					</p>
				) : null }

				{ loading && isEmpty ? (
					<ul className="mt-8 flex flex-col gap-4">
						{ [ 1, 2, 3 ].map( ( key ) => (
							<li key={ key } className="flex animate-pulse gap-4 rounded-md bg-petrol p-4">
								<div className="h-28 w-24 rounded bg-teal" />
								<div className="flex flex-1 flex-col gap-3 py-2">
									<div className="h-5 w-1/2 rounded bg-teal" />
									<div className="h-4 w-1/4 rounded bg-teal" />
								</div>
							</li>
						) ) }
					</ul>
				) : isEmpty ? (
					<div className="mt-10 flex flex-col items-center gap-5 rounded-md bg-petrol px-6 py-20 text-center ring-1 ring-white/10">
						<span className="grid h-20 w-20 place-items-center rounded-full bg-navy text-flame">
							<Icon name="bag" className="h-9 w-9" />
						</span>
						<h2 className="font-display text-5xl uppercase text-cream">Your bag is empty</h2>
						<p className="max-w-md text-peach/80">
							Looks like you haven’t added anything yet. Find your next favourite in the new season edit.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Link href="/shop" className="inline-flex min-h-12 items-center rounded-md bg-rust px-6 text-sm font-bold uppercase tracking-widest text-cream hover:bg-ember hover:text-midnight">
								Shop all
							</Link>
							<Link href="/wishlist" className="inline-flex min-h-12 items-center rounded-md px-6 text-sm font-bold uppercase tracking-widest text-cream ring-1 ring-peach/40 hover:bg-cream hover:text-midnight">
								View wishlist
							</Link>
						</div>
					</div>
				) : (
					<div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
						<div className="lg:col-span-8">
							<div className="hidden grid-cols-12 gap-4 border-b border-white/10 pb-3 text-xs font-bold uppercase tracking-widest text-peach/60 md:grid" aria-hidden="true">
								<span className="col-span-6">Product</span>
								<span className="col-span-2">Price</span>
								<span className="col-span-2">Quantity</span>
								<span className="col-span-2 text-right">Total</span>
							</div>

							<ul className="divide-y divide-white/10">
								{ products.map( ( item ) => (
									<CartLineItem
										key={ item.cartKey }
										item={ item }
										quantity={ quantityOf( item ) }
										isPending={ dirtyKeys.includes( item.cartKey ) }
										onQuantityChange={ ( value ) => onQuantityChange( item.cartKey, value ) }
										onRemove={ () => onRemove( item.cartKey, item.name ) }
										disabled={ updating }
									/>
								) ) }
							</ul>

							<div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-start sm:justify-between">
								<CouponForm onApply={ applyCoupon } disabled={ updating } />

								<button
									type="button"
									onClick={ onUpdateCart }
									disabled={ ! dirtyKeys.length || updating }
									className={ `inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 text-sm font-bold uppercase tracking-widest ring-1 transition duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
										dirtyKeys.length ? 'bg-ember text-midnight ring-ember hover:bg-flame' : 'text-cream ring-peach/30'
									}` }
								>
									<Icon name="returns" className="h-4 w-4" />
									{ updating ? 'Updating…' : 'Update cart' }
								</button>
							</div>
						</div>

						<OrderSummary
							totals={ totals ?? { subtotal: 0, discount: 0, shipping: 0, vat: 0, total: 0 } }
							coupons={ coupons }
							shippingRates={ shippingRates }
							chosenShippingMethod={ chosenShippingMethod }
							country={ country }
							needsShippingAddress={ needsShippingAddress }
							isDirty={ dirtyKeys.length > 0 }
							isBusy={ updating }
							onCountryChange={ setShippingCountry }
							onShippingMethodChange={ setShippingMethod }
							onRemoveCoupon={ removeCoupon }
						/>
					</div>
				) }
			</div>
		</Layout>
	);
}
