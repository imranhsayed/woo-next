import Link from 'next/link';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';

import Icon from '../ui/Icon';
import { categoryHref } from '../../constants/nav';

/**
 * Product information tabs.
 *
 * Description, Details and Reviews, with the roving-tabindex keyboard pattern
 * (arrow keys move between tabs, only the selected one is tabbable).
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const ProductTabs = ( { product, description = '', details = [], reviews = [], ratingCounts = {} } ) => {

	const tabs = [
		{ id: 'desc', label: 'Description' },
		{ id: 'details', label: 'Details' },
		{ id: 'reviews', label: `Reviews (${ product.reviewCount })` },
	];

	const [ active, setActive ] = useState( 'desc' );
	const listRef = useRef( null );

	/**
	 * Open the Reviews tab when the URL points at it.
	 *
	 * The buy box's rating link is an ordinary `#reviews` anchor, so it scrolls
	 * here and selects the right tab, and the state is shareable in the URL.
	 */
	useEffect( () => {

		const syncFromHash = () => {

			if ( '#reviews' === window.location.hash ) {
				setActive( 'reviews' );
			}
		};

		syncFromHash();
		window.addEventListener( 'hashchange', syncFromHash );

		return () => window.removeEventListener( 'hashchange', syncFromHash );
	}, [] );

	/**
	 * Move between tabs with the arrow keys.
	 *
	 * @param {Object} event Keydown event.
	 */
	const onKeyDown = ( event ) => {

		if ( 'ArrowRight' !== event.key && 'ArrowLeft' !== event.key ) {
			return;
		}

		event.preventDefault();

		const index = tabs.findIndex( ( tab ) => tab.id === active );
		const next = tabs[ ( index + ( 'ArrowRight' === event.key ? 1 : -1 ) + tabs.length ) % tabs.length ];

		setActive( next.id );
		listRef.current?.querySelector( `#tab-${ next.id }` )?.focus();
	};

	// Review totals per star, highest first, as a share of all reviews.
	const bars = [ 5, 4, 3, 2, 1 ].map( ( stars ) => ( {
		stars,
		count: ratingCounts[ stars ] ?? 0,
		percent: product.reviewCount ? Math.round( ( ( ratingCounts[ stars ] ?? 0 ) / product.reviewCount ) * 100 ) : 0,
	} ) );

	return (
		<section id="reviews" className="mt-16" aria-label="Product information">
			<div ref={ listRef } role="tablist" aria-label="Product information" className="flex gap-1 overflow-x-auto border-b border-white/10" onKeyDown={ onKeyDown }>
				{ tabs.map( ( tab ) => {

					const isSelected = active === tab.id;

					return (
						<button
							key={ tab.id }
							type="button"
							role="tab"
							id={ `tab-${ tab.id }` }
							aria-selected={ isSelected }
							aria-controls={ `panel-${ tab.id }` }
							tabIndex={ isSelected ? 0 : -1 }
							onClick={ () => setActive( tab.id ) }
							className={ cx(
								'relative shrink-0 px-5 py-4 font-display text-2xl uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-flame',
								isSelected ? 'text-cream' : 'text-peach/60 hover:text-cream'
							) }
						>
							{ tab.label }
							<span className={ cx(
								'absolute inset-x-0 -bottom-px h-1 origin-left bg-ember transition-transform duration-300 motion-reduce:transition-none',
								isSelected ? 'scale-x-100' : 'scale-x-0'
							) } />
						</button>
					);
				} ) }
			</div>

			<div className="py-8">
				{ 'desc' === active ? (
					<div role="tabpanel" id="panel-desc" aria-labelledby="tab-desc" className="grid gap-8 md:grid-cols-2">
						<p className="text-lg leading-relaxed text-peach/90">{ description }</p>
						<div className="rounded-md bg-petrol p-6 ring-1 ring-white/10">
							<p className="font-script text-4xl text-peach">Styling note</p>
							<p className="mt-2 text-sm leading-relaxed text-peach/85">
								Our stylists love it with warm rust and cream tones — browse more in{ ' ' }
								<Link href={ categoryHref( product.departmentSlug ) } className="font-semibold text-flame underline underline-offset-4">
									{ product.department }
								</Link>.
							</p>
						</div>
					</div>
				) : null }

				{ 'details' === active ? (
					<div role="tabpanel" id="panel-details" aria-labelledby="tab-details">
						<ul className="grid gap-3 sm:grid-cols-3">
							{ details.map( ( detail ) => (
								<li key={ detail } className="flex items-start gap-3 rounded-md bg-petrol p-4 text-sm text-peach ring-1 ring-white/10">
									<span className="text-flame"><Icon name="check" /></span>
									{ detail }
								</li>
							) ) }
						</ul>
						<p className="mt-4 text-sm text-peach/70">
							SKU: { product.sku } · Category: { product.department }{ product.subCategory ? ` / ${ product.subCategory }` : '' }
						</p>
					</div>
				) : null }

				{ 'reviews' === active ? (
					<div role="tabpanel" id="panel-reviews" aria-labelledby="tab-reviews" className="grid gap-8 lg:grid-cols-3">
						<div className="rounded-md bg-petrol p-6 ring-1 ring-white/10">
							<p className="font-display text-7xl text-cream">{ product.rating }</p>
							<p className="text-sm text-peach/80">Average from { product.reviewCount } verified reviews</p>
							<ul className="mt-4 flex flex-col gap-2">
								{ bars.map( ( bar ) => (
									<li key={ bar.stars } className="flex items-center gap-3 text-xs text-peach/80">
										<span className="w-8">{ bar.stars }★</span>
										<span className="h-2 flex-1 overflow-hidden rounded-full bg-navy">
											{ /* A percentage width has to be inline: Tailwind cannot
											     generate a class for a value only known at runtime. */ }
											<span className="block h-full rounded-full bg-ember" style={ { width: `${ bar.percent }%` } } />
										</span>
										<span className="w-6 text-right">{ bar.count }</span>
									</li>
								) ) }
							</ul>
						</div>

						{ reviews.length ? (
							<ul className="flex flex-col gap-4 lg:col-span-2">
								{ reviews.map( ( review ) => (
									<li key={ review.id } className="rounded-md bg-petrol p-5 ring-1 ring-white/10">
										<div className="flex items-center justify-between gap-3">
											<p className="font-bold text-cream">
												{ review.author }
												<span className="ml-2 text-xs font-normal text-emerald-300">Verified buyer</span>
											</p>
											<p className="text-xs text-peach/60">{ review.date }</p>
										</div>
										<p className="mt-1 flex gap-0.5 text-flame" role="img" aria-label={ `${ review.rating } out of 5` }>
											{ [ 1, 2, 3, 4, 5 ].map( ( star ) => (
												<Icon key={ star } name="star" className="h-3.5 w-3.5" fill={ star <= review.rating } />
											) ) }
										</p>
										<p className="mt-2 text-sm leading-relaxed text-peach/90">{ review.content }</p>
									</li>
								) ) }
							</ul>
						) : (
							<p className="rounded-md bg-petrol p-6 text-sm text-peach/80 ring-1 ring-white/10 lg:col-span-2">
								No reviews yet — be the first to review this piece.
							</p>
						) }
					</div>
				) : null }
			</div>
		</section>
	);
};

ProductTabs.propTypes = {
	product: PropTypes.object.isRequired,
	description: PropTypes.string,
	details: PropTypes.array,
	reviews: PropTypes.array,
	ratingCounts: PropTypes.object,
};

export default ProductTabs;
