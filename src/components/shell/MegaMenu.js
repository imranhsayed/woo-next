import Link from 'next/link';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Img from '../ui/Img';
import { MEGA_MENU_CATEGORIES, PROMO_CATEGORIES, categoryHref } from '../../constants/nav';

/**
 * Desktop "Categories" mega menu.
 *
 * Three columns of category links plus a fourth "Collections" column, beside
 * two promo tiles that reuse the New Arrivals and Offers category images.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const MegaMenu = ( { isOpen, onClose, bySlug = {}, id = 'mega' } ) => {

	const columns = MEGA_MENU_CATEGORIES
		.map( ( slug ) => bySlug[ slug ] )
		.filter( Boolean );

	const newArrivals = bySlug[ PROMO_CATEGORIES.new ];
	const offers = bySlug[ PROMO_CATEGORIES.offers ];

	return (
		<div
			id={ id }
			onKeyDown={ ( event ) => 'Escape' === event.key && onClose() }
			className={ cx(
				'absolute inset-x-0 top-full hidden origin-top bg-midnight text-peach shadow-2xl shadow-black/50 transition-all duration-300 lg:block motion-reduce:transition-none',
				isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
			) }
		>
			<div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-10">
				<div className="col-span-7 grid grid-cols-3 gap-8">
					{ columns.map( ( category ) => (
						<div key={ category.slug }>
							<Link
								href={ category.href }
								onClick={ onClose }
								className="font-display text-2xl uppercase tracking-wide text-cream transition-colors hover:text-flame"
							>
								{ category.name }
							</Link>
							<ul className="mt-3 flex flex-col gap-2 text-sm">
								<li>
									<Link href={ category.href } onClick={ onClose } className="text-peach/80 transition-colors hover:text-flame">
										All { category.name }
									</Link>
								</li>
								{ category.children.map( ( child ) => (
									<li key={ child.slug }>
										<Link href={ child.href } onClick={ onClose } className="text-peach/80 transition-colors hover:text-flame">
											{ child.name }
										</Link>
									</li>
								) ) }
							</ul>
						</div>
					) ) }

					<div>
						<Link href="/shop" onClick={ onClose } className="font-display text-2xl uppercase tracking-wide text-cream transition-colors hover:text-flame">
							Collections
						</Link>
						<ul className="mt-3 flex flex-col gap-2 text-sm">
							<li><Link href={ categoryHref( 'new' ) } onClick={ onClose } className="text-peach/80 transition-colors hover:text-flame">New arrivals</Link></li>
							<li><Link href={ categoryHref( 'offers' ) } onClick={ onClose } className="text-peach/80 transition-colors hover:text-flame">Offers</Link></li>
							<li><Link href="/shop" onClick={ onClose } className="text-peach/80 transition-colors hover:text-flame">All products</Link></li>
						</ul>
					</div>
				</div>

				<div className="col-span-5 grid grid-cols-2 gap-4">
					<Link href={ categoryHref( 'new' ) } onClick={ onClose } className="group relative aspect-portrait overflow-hidden rounded-md bg-teal">
						<Img
							src={ newArrivals?.image?.sourceUrl ?? '' }
							alt=""
							sizes="(min-width: 1024px) 20vw, 50vw"
							className="transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
						/>
						<span className="absolute inset-0 bg-gradient-to-t from-midnight/90 to-transparent" />
						<span className="absolute bottom-4 left-4 font-display text-3xl uppercase leading-none text-cream">New<br />arrivals</span>
					</Link>

					<Link href={ categoryHref( 'offers' ) } onClick={ onClose } className="group relative aspect-portrait overflow-hidden rounded-md bg-rust">
						<Img
							src={ offers?.image?.sourceUrl ?? '' }
							alt=""
							sizes="(min-width: 1024px) 20vw, 50vw"
							className="opacity-80 mix-blend-multiply transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
						/>
						<span className="absolute left-4 top-4 font-display text-5xl uppercase leading-none text-cream">Up to<br />30% off</span>
						<span className="absolute bottom-4 left-4 rounded-full bg-cream px-3 py-1 text-xs font-bold uppercase tracking-widest text-midnight">Shop offers</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

MegaMenu.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	bySlug: PropTypes.object,
	id: PropTypes.string,
};

export default MegaMenu;
