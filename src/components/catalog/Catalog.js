import Link from 'next/link';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import cx from 'classnames';

import Icon from '../ui/Icon';
import ProductCard from '../product/ProductCard';
import CatalogHero from './CatalogHero';
import FilterSidebar from './FilterSidebar';
import useCatalogFilters from '../../hooks/useCatalogFilters';
import { EMPTY_STATE_LINKS, SORT_OPTIONS } from '../../constants/categories';

/**
 * Catalog view.
 *
 * Drives /shop, every category landing page and the search results page: hero,
 * optional subcategory nav, filter sidebar, sort control, applied-filter chips,
 * the product grid and numbered pagination.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const Catalog = ( {
	products = [],
	popularityOrder = [],
	hero,
	crumbs = [],
	groups = [],
	groupLegend = 'Category',
	subNav = [],
	activeSubSlug = '',
	initialGroups = [],
	searchTerm = null,
	uid = 'catalog',
} ) => {

	const [ isFilterOpen, setFilterOpen ] = useState( false );

	const {
		filters, update, toggle, clearAll,
		facets, chips, activeCount,
		results, total, page, totalPages, setPage,
		rangeStart, rangeEnd,
	} = useCatalogFilters( products, { groups, popularityOrder, initialGroups } );

	// Close the filter dialog when the viewport grows past the drawer breakpoint.
	useEffect( () => {

		if ( ! isFilterOpen ) {
			return;
		}

		const query = window.matchMedia( '(min-width: 1024px)' );
		const onChange = () => query.matches && setFilterOpen( false );

		query.addEventListener( 'change', onChange );

		return () => query.removeEventListener( 'change', onChange );
	}, [ isFilterOpen ] );

	useEffect( () => {

		document.body.classList.toggle( 'overflow-hidden', isFilterOpen );

		return () => document.body.classList.remove( 'overflow-hidden' );
	}, [ isFilterOpen ] );

	/**
	 * Move to another page and return to the top of the results.
	 *
	 * @param {number} next Target page.
	 */
	const goToPage = ( next ) => {

		setPage( Math.min( Math.max( 1, next ), totalPages ) );

		const prefersReducedMotion = window.matchMedia?.( '(prefers-reduced-motion: reduce)' ).matches;

		window.scrollTo( { top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' } );
	};

	const hasNoResults = 0 === total;
	const isEmptySource = 0 === products.length;

	return (
		<div className="pb-16">
			<CatalogHero
				kicker={ hero.kicker }
				title={ hero.title }
				blurb={ hero.blurb }
				images={ hero.images }
				crumbs={ crumbs }
				searchTerm={ searchTerm }
			/>

			{ subNav.length ? (
				<nav aria-label="Subcategories" className="border-b border-white/10 bg-navy">
					<ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
						{ subNav.map( ( item ) => {

							const isCurrent = item.slug === activeSubSlug;

							return (
								<li key={ item.slug || 'all' } className="shrink-0">
									<Link
										href={ item.href }
										aria-current={ isCurrent ? 'page' : undefined }
										className={ cx(
											'inline-flex min-h-11 items-center rounded-full px-5 text-sm font-bold uppercase tracking-widest transition duration-200',
											isCurrent ? 'bg-ember text-midnight' : 'text-cream ring-1 ring-peach/30 hover:bg-cream hover:text-midnight'
										) }
									>
										{ item.name } <span className="ml-1.5 text-xs opacity-70">{ item.count }</span>
									</Link>
								</li>
							);
						} ) }
					</ul>
				</nav>
			) : null }

			<div className="mx-auto flex max-w-7xl gap-8 px-4 pt-8 sm:px-6 lg:px-8">
				<FilterSidebar
					facets={ facets }
					filters={ filters }
					toggle={ toggle }
					update={ update }
					clearAll={ clearAll }
					groupLegend={ groupLegend }
					isOpen={ isFilterOpen }
					onClose={ () => setFilterOpen( false ) }
					resultCount={ total }
					uid={ uid }
				/>

				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<p className="text-sm text-peach/80" aria-live="polite">
							{ total
								? `Showing ${ rangeStart }–${ rangeEnd } of ${ total } products`
								: '0 products' }
						</p>

						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={ () => setFilterOpen( true ) }
								aria-expanded={ isFilterOpen }
								className="inline-flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-bold uppercase tracking-widest text-cream ring-1 ring-peach/40 transition hover:bg-cream hover:text-midnight lg:hidden"
							>
								<Icon name="sliders" className="h-4 w-4" />Filters
								{ activeCount ? (
									<span className="grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-xs text-midnight">{ activeCount }</span>
								) : null }
							</button>

							<label htmlFor={ `sort-${ uid }` } className="sr-only">Sort products</label>
							<select
								id={ `sort-${ uid }` }
								value={ filters.sort }
								onChange={ ( event ) => update( { sort: event.target.value }, true ) }
								className="min-h-11 rounded-md border-0 bg-petrol py-2 pl-3 pr-9 text-sm font-semibold text-cream ring-1 ring-peach/30 focus:ring-2 focus:ring-flame"
							>
								{ SORT_OPTIONS.map( ( option ) => (
									<option key={ option.id } value={ option.id }>{ option.label }</option>
								) ) }
							</select>
						</div>
					</div>

					{ activeCount ? (
						<ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Applied filters">
							{ chips.map( ( chip ) => (
								<li key={ chip.key }>
									<button
										type="button"
										onClick={ chip.remove }
										aria-label={ `Remove filter ${ chip.label }` }
										className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-cream py-1 pl-3 pr-2 text-xs font-bold uppercase tracking-wider text-midnight transition hover:bg-peach"
									>
										{ chip.label }
										<Icon name="x" className="h-3.5 w-3.5" />
									</button>
								</li>
							) ) }
							<li>
								<button
									type="button"
									onClick={ clearAll }
									className="min-h-9 px-2 text-xs font-bold uppercase tracking-widest text-flame underline-offset-4 hover:underline"
								>
									Clear all
								</button>
							</li>
						</ul>
					) : null }

					{ hasNoResults ? (
						<div className="mt-6 flex flex-col items-center gap-4 rounded-md bg-petrol px-6 py-16 text-center ring-1 ring-white/10">
							<span className="grid h-16 w-16 place-items-center rounded-full bg-navy text-flame">
								<Icon name="search" className="h-7 w-7" />
							</span>
							<h2 className="font-display text-4xl uppercase text-cream">
								{ isEmptySource && searchTerm ? 'Nothing found' : 'No matches' }
							</h2>
							<p className="max-w-md text-sm text-peach/80">
								{ isEmptySource && searchTerm
									? `We couldn’t find anything for “${ searchTerm }”. Try a broader term, check the spelling, or browse a popular category.`
									: 'No products match these filters. Try removing a filter or two.' }
							</p>
							<div className="flex flex-wrap justify-center gap-2">
								{ activeCount ? (
									<button
										type="button"
										onClick={ clearAll }
										className="min-h-11 rounded-md bg-rust px-5 text-sm font-bold uppercase tracking-widest text-cream hover:bg-ember hover:text-midnight"
									>
										Clear filters
									</button>
								) : null }
								{ EMPTY_STATE_LINKS.map( ( link ) => (
									<Link
										key={ link.href }
										href={ link.href }
										className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-cream ring-1 ring-peach/30 hover:bg-cream hover:text-midnight"
									>
										{ link.label }
									</Link>
								) ) }
							</div>
						</div>
					) : (
						<ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
							{ results.map( ( product, index ) => (
								<li key={ product.slug }>
									<ProductCard
										product={ product }
										priority={ 1 === page && index < 3 }
										sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
									/>
								</li>
							) ) }
						</ul>
					) }

					{ totalPages > 1 ? (
						<nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
							<button
								type="button"
								onClick={ () => goToPage( page - 1 ) }
								disabled={ page <= 1 }
								aria-label="Previous page"
								className="grid h-11 w-11 place-items-center rounded-full text-cream ring-1 ring-peach/40 transition hover:bg-cream hover:text-midnight disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-cream"
							>
								<Icon name="chevron-left" />
							</button>

							{ Array.from( { length: totalPages }, ( _, index ) => index + 1 ).map( ( number ) => (
								<button
									key={ number }
									type="button"
									onClick={ () => goToPage( number ) }
									aria-current={ number === page ? 'page' : undefined }
									aria-label={ `Page ${ number }` }
									className={ cx(
										'grid h-11 w-11 place-items-center rounded-full font-display text-lg transition duration-200',
										number === page ? 'bg-cream text-midnight' : 'text-cream ring-1 ring-peach/30 hover:bg-white/10'
									) }
								>
									{ number }
								</button>
							) ) }

							<button
								type="button"
								onClick={ () => goToPage( page + 1 ) }
								disabled={ page >= totalPages }
								aria-label="Next page"
								className="grid h-11 w-11 place-items-center rounded-full bg-ember text-midnight transition hover:bg-flame disabled:opacity-30"
							>
								<Icon name="chevron-right" />
							</button>
						</nav>
					) : null }
				</div>
			</div>
		</div>
	);
};

Catalog.propTypes = {
	products: PropTypes.array,
	popularityOrder: PropTypes.array,
	hero: PropTypes.object.isRequired,
	crumbs: PropTypes.array,
	groups: PropTypes.array,
	groupLegend: PropTypes.string,
	subNav: PropTypes.array,
	activeSubSlug: PropTypes.string,
	initialGroups: PropTypes.array,
	searchTerm: PropTypes.string,
	uid: PropTypes.string,
};

export default Catalog;
