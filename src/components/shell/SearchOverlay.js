import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import useFocusTrap from '../../hooks/useFocusTrap';
import { SEARCH_PRODUCTS, GET_TRENDING_PRODUCTS } from '../../queries/search-products';
import { decodeHtmlEntities } from '../../functions';
import { SUGGESTED_SEARCHES, productHref, searchHref } from '../../constants/nav';

/** How long to wait after the last keystroke before querying. */
const DEBOUNCE_MS = 350;

const RESULT_LIMIT = 6;

/**
 * Pick the subcategory to show above a result's name.
 *
 * A product sits in its parent category, its subcategory and possibly New or
 * Offers; the subcategory (the one with a parent) is the useful label.
 *
 * @param {Object} product Product node.
 *
 * @return {string} Category name, or an empty string.
 */
const subCategoryName = ( product ) => {

	const nodes = product?.productCategories?.nodes ?? [];

	return nodes.find( ( node ) => node.parentDatabaseId )?.name ?? nodes[ 0 ]?.name ?? '';
};

/**
 * Full-width search overlay.
 *
 * Empty state offers suggested searches, popular categories and trending
 * products; typing debounces into a catalog search and shows skeletons, a
 * no-match panel, or the first six matches with a link to the full results.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const SearchOverlay = ( { isOpen, onClose, categories = [] } ) => {

	const router = useRouter();
	const panelRef = useFocusTrap( isOpen, onClose );

	const [ term, setTerm ] = useState( '' );
	const [ debouncedTerm, setDebouncedTerm ] = useState( '' );

	const trimmed = term.trim();

	// Debounce so a fast typist triggers one query, not one per character.
	useEffect( () => {

		const timer = setTimeout( () => setDebouncedTerm( trimmed ), DEBOUNCE_MS );

		return () => clearTimeout( timer );
	}, [ trimmed ] );

	// Reset the field each time the overlay opens.
	useEffect( () => {

		if ( ! isOpen ) {
			setTerm( '' );
			setDebouncedTerm( '' );
		}
	}, [ isOpen ] );

	const { data: searchData, loading: searching } = useQuery( SEARCH_PRODUCTS, {
		variables: { search: debouncedTerm, first: RESULT_LIMIT },
		skip: ! isOpen || ! debouncedTerm,
	} );

	const { data: trendingData } = useQuery( GET_TRENDING_PRODUCTS, {
		variables: { first: 4 },
		skip: ! isOpen,
	} );

	const results = searchData?.products?.nodes ?? [];
	const found = searchData?.products?.found ?? 0;
	const trending = trendingData?.products?.nodes ?? [];

	// `searching` only covers the request; the debounce window counts as pending too.
	const isPending = !! trimmed && ( searching || trimmed !== debouncedTerm );
	const showEmptyState = ! trimmed;
	const showNoMatches = !! trimmed && ! isPending && ! results.length;
	const showResults = !! trimmed && ! isPending && results.length > 0;

	const onSubmit = ( event ) => {

		event.preventDefault();

		if ( ! trimmed ) {
			return;
		}

		onClose();
		router.push( searchHref( trimmed ) );
	};

	const resultCard = ( product ) => ( {
		key: product.databaseId,
		name: product.name,
		sub: subCategoryName( product ),
		price: decodeHtmlEntities( product.price ?? '' ),
		href: productHref( product.slug ),
		image: product.image?.sourceUrl ?? '',
		alt: product.image?.altText || product.name,
	} );

	return (
		<div
			className={ cx(
				'fixed inset-0 z-50 transition-all duration-300 motion-reduce:transition-none',
				isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
			) }
			aria-hidden={ isOpen ? 'false' : 'true' }
		>
			<div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" onClick={ onClose } />

			<div
				ref={ panelRef }
				role="dialog"
				aria-modal="true"
				aria-label="Search"
				className={ cx(
					'relative max-h-screen overflow-y-auto bg-petrol shadow-2xl transition-transform duration-300 motion-reduce:transition-none',
					isOpen ? 'translate-y-0' : '-translate-y-full'
				) }
			>
				<div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
					<form onSubmit={ onSubmit } noValidate role="search" className="flex items-center gap-3 border-b-2 border-peach/30 pb-3 focus-within:border-ember">
						<span className="text-flame"><Icon name="search" className="h-6 w-6" /></span>
						<label htmlFor="site-search" className="sr-only">Search WooNext</label>
						<input
							id="site-search"
							data-autofocus="true"
							type="search"
							autoComplete="off"
							value={ term }
							onChange={ ( event ) => setTerm( event.target.value ) }
							placeholder="Search jackets, dresses, sneakers…"
							className="min-w-0 flex-1 border-0 bg-transparent font-display text-3xl uppercase tracking-wide text-cream placeholder-peach/40 focus:outline-none focus:ring-0 sm:text-5xl"
						/>
						{ term ? (
							<button
								type="button"
								onClick={ () => setTerm( '' ) }
								className="h-11 rounded-full px-4 text-xs font-bold uppercase tracking-widest text-peach ring-1 ring-peach/30 transition hover:bg-cream hover:text-midnight"
							>
								Clear
							</button>
						) : null }
						<button
							type="button"
							onClick={ onClose }
							aria-label="Close search"
							className="grid h-11 w-11 place-items-center rounded-full bg-rust text-cream transition hover:bg-ember hover:text-midnight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame"
						>
							<Icon name="x" />
						</button>
					</form>

					<div className="mt-8" aria-live="polite">
						{ showEmptyState ? (
							<div className="grid gap-8 md:grid-cols-3">
								<div>
									<h3 className="text-xs font-bold uppercase tracking-widest text-flame">Suggested searches</h3>
									<ul className="mt-3 flex flex-wrap gap-2">
										{ SUGGESTED_SEARCHES.map( ( suggestion ) => (
											<li key={ suggestion }>
												<button
													type="button"
													onClick={ () => setTerm( suggestion ) }
													className="min-h-11 rounded-full px-4 text-sm text-cream ring-1 ring-peach/30 transition hover:bg-cream hover:text-midnight"
												>
													{ suggestion }
												</button>
											</li>
										) ) }
									</ul>
								</div>

								<div>
									<h3 className="text-xs font-bold uppercase tracking-widest text-flame">Popular categories</h3>
									<ul className="mt-3 flex flex-col gap-2">
										{ categories.slice( 0, 5 ).map( ( category ) => (
											<li key={ category.slug }>
												<Link
													href={ category.href }
													onClick={ onClose }
													className="font-display text-2xl uppercase tracking-wide text-cream transition-colors hover:text-flame"
												>
													{ category.name }
												</Link>
											</li>
										) ) }
									</ul>
								</div>

								<div>
									<h3 className="text-xs font-bold uppercase tracking-widest text-flame">Trending now</h3>
									<ul className="mt-3 flex flex-col gap-3">
										{ trending.map( resultCard ).map( ( card ) => (
											<li key={ card.key }>
												<Link href={ card.href } onClick={ onClose } className="group flex items-center gap-3">
													<span className="relative h-14 w-12 shrink-0 overflow-hidden rounded bg-teal">
														<Img src={ card.image } alt="" sizes="48px" />
													</span>
													<span>
														<span className="block text-sm font-semibold text-cream group-hover:text-flame">{ card.name }</span>
														<span className="text-sm text-flame">{ card.price }</span>
													</span>
												</Link>
											</li>
										) ) }
									</ul>
								</div>
							</div>
						) : null }

						{ isPending ? (
							<>
								<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
									{ [ 1, 2, 3, 4, 5, 6 ].map( ( key ) => (
										<div key={ key } className="flex animate-pulse gap-3">
											<div className="h-20 w-16 rounded bg-teal" />
											<div className="flex flex-1 flex-col gap-2 pt-2">
												<div className="h-3 w-3/4 rounded bg-teal" />
												<div className="h-3 w-1/3 rounded bg-teal" />
											</div>
										</div>
									) ) }
								</div>
								<p className="sr-only">Searching…</p>
							</>
						) : null }

						{ showNoMatches ? (
							<div className="rounded-md bg-navy p-6">
								<p className="font-display text-3xl uppercase text-cream">No matches for “{ trimmed }”</p>
								<p className="mt-2 text-sm text-peach/80">Check the spelling or try a broader term like:</p>
								<ul className="mt-4 flex flex-wrap gap-2">
									{ SUGGESTED_SEARCHES.map( ( suggestion ) => (
										<li key={ suggestion }>
											<button
												type="button"
												onClick={ () => setTerm( suggestion ) }
												className="min-h-11 rounded-full px-4 text-sm text-cream ring-1 ring-peach/30 transition hover:bg-cream hover:text-midnight"
											>
												{ suggestion }
											</button>
										</li>
									) ) }
								</ul>
							</div>
						) : null }

						{ showResults ? (
							<>
								<p className="text-xs font-bold uppercase tracking-widest text-flame">{ found } products</p>
								<ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{ results.map( resultCard ).map( ( card ) => (
										<li key={ card.key }>
											<Link href={ card.href } onClick={ onClose } className="group flex items-center gap-4 rounded-md p-2 transition hover:bg-navy">
												<span className="relative h-24 w-20 shrink-0 overflow-hidden rounded bg-ember">
													<Img src={ card.image } alt="" sizes="80px" className="transition duration-500 group-hover:scale-110 motion-reduce:transform-none" />
												</span>
												<span>
													<span className="block text-xs uppercase tracking-widest text-peach/70">{ card.sub }</span>
													<span className="block font-display text-xl uppercase leading-tight tracking-wide text-cream group-hover:text-flame">{ card.name }</span>
													<span className="text-sm font-semibold text-flame">{ card.price }</span>
												</span>
											</Link>
										</li>
									) ) }
								</ul>
								<Link
									href={ searchHref( trimmed ) }
									onClick={ onClose }
									className="group mt-6 inline-flex min-h-12 items-center gap-3 rounded-md bg-rust px-6 text-sm font-bold uppercase tracking-widest text-cream transition hover:bg-ember hover:text-midnight"
								>
									View all { found } results
									<span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
										<Icon name="arrow-right" className="h-4 w-4" />
									</span>
								</Link>
							</>
						) : null }
					</div>
				</div>
			</div>
		</div>
	);
};

export default SearchOverlay;
