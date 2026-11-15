import Link from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useState } from 'react';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import { searchHref } from '../../constants/nav';

/**
 * Catalog hero.
 *
 * Split-screen imagery behind the breadcrumb, kicker, display headline and
 * blurb. On search results it also carries a search field pre-filled with the
 * current term.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const CatalogHero = ( { kicker, title, blurb, images = [], crumbs = [], searchTerm = null } ) => {

	const router = useRouter();
	const [ term, setTerm ] = useState( searchTerm ?? '' );

	const isSearch = null !== searchTerm;

	const onSubmit = ( event ) => {

		event.preventDefault();

		const trimmed = term.trim();

		if ( trimmed ) {
			router.push( searchHref( trimmed ) );
		}
	};

	return (
		<section className="relative isolate overflow-hidden bg-petrol">
			{ /* `images` arrives as resolved URLs; the page owns where they come from. */ }
			<div className="absolute inset-0 grid grid-cols-2">
				{ images.map( ( url, index ) => (
					<div key={ url } className="relative h-full w-full">
						<Img src={ url } alt="" priority={ 0 === index } sizes="50vw" />
					</div>
				) ) }
			</div>
			<div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/80 to-petrol/30" />

			<div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
				<nav aria-label="Breadcrumb">
					<ol className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-peach/70">
						{ crumbs.map( ( crumb, index ) => {

							const isLast = index === crumbs.length - 1;

							return (
								<li key={ crumb.label + index } className="flex items-center gap-2">
									{ isLast || ! crumb.href ? (
										<span aria-current="page" className="text-cream">{ crumb.label }</span>
									) : (
										<>
											<Link href={ crumb.href } className="hover:text-flame">{ crumb.label }</Link>
											<span aria-hidden="true">/</span>
										</>
									) }
								</li>
							);
						} ) }
					</ol>
				</nav>

				<p className="font-script text-4xl text-peach">{ kicker }</p>
				<h1 className="max-w-3xl font-display text-6xl uppercase leading-none text-cream sm:text-7xl lg:text-8xl">{ title }</h1>
				{ blurb ? <p className="max-w-xl text-base leading-relaxed text-peach/85">{ blurb }</p> : null }

				{ isSearch ? (
					<form onSubmit={ onSubmit } role="search" className="mt-2 flex w-full max-w-xl overflow-hidden rounded-md bg-cream ring-2 ring-transparent focus-within:ring-ember">
						<label htmlFor="catalog-search" className="sr-only">Search products</label>
						<input
							id="catalog-search"
							type="search"
							value={ term }
							onChange={ ( event ) => setTerm( event.target.value ) }
							placeholder="Search WooNext"
							className="min-h-12 flex-1 border-0 bg-transparent px-4 font-semibold text-midnight placeholder-midnight/50 focus:outline-none focus:ring-0"
						/>
						<button type="submit" className="inline-flex items-center gap-2 bg-rust px-5 text-sm font-bold uppercase tracking-widest text-cream transition hover:bg-midnight">
							<Icon name="search" className="h-4 w-4" />Search
						</button>
					</form>
				) : null }
			</div>
		</section>
	);
};

CatalogHero.propTypes = {
	kicker: PropTypes.string,
	title: PropTypes.string,
	blurb: PropTypes.string,
	images: PropTypes.array,
	crumbs: PropTypes.array,
	searchTerm: PropTypes.string,
};

export default CatalogHero;
