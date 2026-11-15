import Link from "next/link";
import { useQuery } from "@apollo/client";

import Layout from "../src/components/Layout";
import Icon from "../src/components/ui/Icon";
import ProductCard from "../src/components/product/ProductCard";
import { useUI } from "../src/components/context/UIContext";
import GET_PRODUCTS_BY_IDS from "../src/queries/get-products-by-ids";
import { normaliseProducts } from "../src/utils/product";

/**
 * Wishlist page.
 *
 * The saved list is browser-local — accounts arrive in a later step — so the
 * products behind it are fetched on the client once the ids have hydrated.
 *
 * @return {jsx}
 */
export default function WishlistPage() {

	const { wishlist, toggleWishlist } = useUI();

	const { data, loading } = useQuery( GET_PRODUCTS_BY_IDS, {
		variables: { ids: wishlist },
		skip: ! wishlist.length,
	} );

	// Keep the shopper's own order: most recently saved first.
	const products = normaliseProducts( data?.products?.nodes ?? [] )
		.sort( ( a, b ) => wishlist.indexOf( b.databaseId ) - wishlist.indexOf( a.databaseId ) );

	const isEmpty = ! wishlist.length;

	return (
		<Layout title="Wishlist — WooNext">
			<div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
				<nav aria-label="Breadcrumb">
					<ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-peach/70">
						<li><Link href="/" className="hover:text-flame">Home</Link></li>
						<li aria-hidden="true">/</li>
						<li aria-current="page" className="text-cream">Wishlist</li>
					</ol>
				</nav>

				<div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
					<h1 className="font-display text-6xl uppercase leading-none text-cream sm:text-7xl">
						Wishlist <span className="text-flame">({ wishlist.length })</span>
					</h1>
					<Link href="/shop" className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-peach hover:text-flame">
						<span className="transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transform-none">
							<Icon name="arrow-left" className="h-4 w-4" />
						</span>
						Continue shopping
					</Link>
				</div>

				{ isEmpty ? (
					<div className="mt-10 flex flex-col items-center gap-5 rounded-md bg-petrol px-6 py-20 text-center ring-1 ring-white/10">
						<span className="grid h-20 w-20 place-items-center rounded-full bg-navy text-flame">
							<Icon name="heart" className="h-9 w-9" />
						</span>
						<h2 className="font-display text-5xl uppercase text-cream">Nothing saved yet</h2>
						<p className="max-w-md text-peach/80">Tap the heart on any product to save it here for later.</p>
						<Link href="/category/new" className="inline-flex min-h-12 items-center rounded-md bg-rust px-6 text-sm font-bold uppercase tracking-widest text-cream hover:bg-ember hover:text-midnight">
							Discover new arrivals
						</Link>
					</div>
				) : (
					<>
						<p className="mt-6 text-sm text-peach/80" aria-live="polite">
							Saved items stay here between visits on this device. Items with options need a size before they go in your bag.
						</p>

						{ loading && ! products.length ? (
							<ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
								{ wishlist.map( ( id ) => (
									<li key={ id } className="aspect-portrait animate-pulse rounded-md bg-petrol" />
								) ) }
							</ul>
						) : (
							<ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
								{ products.map( ( product ) => (
									<li key={ product.slug } className="flex flex-col gap-2">
										<ProductCard product={ product } sizes="(min-width: 1024px) 25vw, 50vw" />
										<button
											type="button"
											onClick={ () => toggleWishlist( product.databaseId, product.name ) }
											className="inline-flex min-h-10 items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-peach/70 transition-colors hover:text-flame"
										>
											<Icon name="trash" className="h-4 w-4" />Remove from wishlist
										</button>
									</li>
								) ) }
							</ul>
						) }
					</>
				) }
			</div>
		</Layout>
	);
}
