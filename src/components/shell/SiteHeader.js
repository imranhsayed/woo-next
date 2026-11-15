import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';

import Icon from '../ui/Icon';
import MegaMenu from './MegaMenu';
import SearchOverlay from './SearchOverlay';
import MobileNav from './MobileNav';
import CartDrawer from './CartDrawer';
import { useUI } from '../context/UIContext';
import useCart from '../../hooks/useCart';
import useNavCategories from '../../hooks/useNavCategories';
import { HEADER_NAV, categoryHref } from '../../constants/nav';

/**
 * Round icon button shared by the header actions.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const IconButton = ( { as = 'button', className = '', children, ...rest } ) => {

	const Tag = as;

	return (
		<Tag
			className={ cx(
				'relative grid h-11 w-11 place-items-center rounded-full bg-rust text-cream transition duration-200 hover:bg-midnight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rust/50',
				className
			) }
			{ ...rest }
		>
			{ children }
		</Tag>
	);
};

/**
 * Small count badge on the wishlist and bag buttons.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const CountBadge = ( { count, bump = false } ) => (
	<span className={ cx(
		'absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-midnight px-1 text-xs font-bold text-peach ring-2 ring-peach transition-transform duration-300 motion-reduce:transition-none',
		bump ? 'scale-125' : 'scale-100'
	) }>
		{ count }
	</span>
);

/**
 * Sticky storefront header.
 *
 * Peach bar with the wordmark, the category mega menu, the top-level category
 * links and the search / account / wishlist / bag actions. Owns the three
 * overlays it opens.
 *
 * @return {jsx}
 */
const SiteHeader = () => {

	const router = useRouter();
	const { overlays, openSearch, closeSearch, openCart, closeCart, openNav, closeNav, wishlistCount } = useUI();
	const { count: cartCount } = useCart();
	const { categories, bySlug } = useNavCategories();

	const [ isMegaOpen, setMegaOpen ] = useState( false );
	const [ bump, setBump ] = useState( false );

	const previousCount = useRef( cartCount );

	// Pulse the bag badge when the cart grows.
	useEffect( () => {

		if ( cartCount > previousCount.current ) {
			setBump( true );
			const timer = setTimeout( () => setBump( false ), 300 );
			previousCount.current = cartCount;

			return () => clearTimeout( timer );
		}

		previousCount.current = cartCount;
	}, [ cartCount ] );

	// Close the mega menu on navigation and on Escape.
	useEffect( () => {

		const close = () => setMegaOpen( false );

		router.events.on( 'routeChangeStart', close );

		const onKeyDown = ( event ) => 'Escape' === event.key && setMegaOpen( false );

		document.addEventListener( 'keydown', onKeyDown );

		return () => {
			router.events.off( 'routeChangeStart', close );
			document.removeEventListener( 'keydown', onKeyDown );
		};
	}, [ router.events ] );

	/**
	 * Header links render from config so they exist in the server HTML, then
	 * adopt the live category name once the nav query resolves.
	 */
	const navLinks = HEADER_NAV.map( ( item ) => ( {
		slug: item.slug,
		name: bySlug[ item.slug ]?.name ?? item.label,
		href: bySlug[ item.slug ]?.href ?? categoryHref( item.slug ),
	} ) );

	// Accounts arrive in a later step; until then the icon points at sign-in.
	const accountHref = '/login';

	return (
		<>
			<header
				className="sticky top-0 z-40 bg-peach text-midnight shadow-lg shadow-black/20"
				onMouseLeave={ () => setMegaOpen( false ) }
			>
				<div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
					<button
						type="button"
						onClick={ openNav }
						aria-label="Open menu"
						aria-expanded={ overlays.nav }
						className="grid h-11 w-11 place-items-center rounded-full text-rust transition-colors hover:bg-rust hover:text-cream focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rust/50 lg:hidden"
					>
						<Icon name="menu" className="h-6 w-6" />
					</button>

					<Link
						href="/"
						aria-label="WooNext home"
						className="flex flex-1 items-center justify-center gap-1 font-display text-3xl uppercase leading-none tracking-wide text-rust focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rust/40 lg:flex-none lg:justify-start lg:text-4xl"
					>
						Woo<span className="text-midnight">next</span>
					</Link>

					<nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
						<ul className="flex items-center gap-1">
							<li>
								<button
									type="button"
									onClick={ () => setMegaOpen( ( open ) => ! open ) }
									onMouseEnter={ () => setMegaOpen( true ) }
									aria-expanded={ isMegaOpen }
									aria-controls="mega"
									className="group relative flex h-11 items-center gap-1 px-3 text-sm font-bold uppercase tracking-widest transition-colors hover:text-rust focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust"
								>
									Categories
									<span className={ cx( 'transition-transform duration-300 motion-reduce:transition-none', isMegaOpen && 'rotate-180' ) }>
										<Icon name="chevron-down" className="h-4 w-4" />
									</span>
									<span className="absolute inset-x-3 bottom-1.5 h-0.5 origin-left scale-x-0 bg-rust transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none" />
								</button>
							</li>

							{ navLinks.map( ( category ) => {

								const isCurrent = router.asPath.startsWith( category.href );

								return (
									<li key={ category.slug }>
										<Link
											href={ category.href }
											aria-current={ isCurrent ? 'page' : undefined }
											className={ cx(
												'group relative flex h-11 items-center px-3 text-sm font-bold uppercase tracking-widest transition-colors hover:text-rust focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust',
												isCurrent && 'text-rust'
											) }
										>
											{ category.name }
											<span className={ cx(
												'absolute inset-x-3 bottom-1.5 h-0.5 origin-left bg-rust transition-transform duration-300 group-hover:scale-x-100 motion-reduce:transition-none',
												isCurrent ? 'scale-x-100' : 'scale-x-0'
											) } />
										</Link>
									</li>
								);
							} ) }
						</ul>
					</nav>

					<div className="flex items-center gap-1.5 sm:gap-2">
						<IconButton onClick={ openSearch } aria-label="Search products">
							<Icon name="search" />
						</IconButton>

						<IconButton as={ Link } href={ accountHref } aria-label="Sign in" className="hidden sm:grid">
							<Icon name="user" />
						</IconButton>

						<IconButton as={ Link } href="/wishlist" aria-label={ `Wishlist, ${ wishlistCount } items` } className="hidden sm:grid">
							<Icon name="heart" />
							{ wishlistCount > 0 ? <CountBadge count={ wishlistCount } /> : null }
						</IconButton>

						<IconButton onClick={ openCart } aria-label={ `Shopping bag, ${ cartCount } items` }>
							<Icon name="bag" />
							{ cartCount > 0 ? <CountBadge count={ cartCount } bump={ bump } /> : null }
						</IconButton>
					</div>
				</div>

				<MegaMenu isOpen={ isMegaOpen } onClose={ () => setMegaOpen( false ) } bySlug={ bySlug } />
			</header>

			<SearchOverlay isOpen={ overlays.search } onClose={ closeSearch } categories={ categories } />
			<MobileNav
				isOpen={ overlays.nav }
				onClose={ closeNav }
				categories={ categories }
				wishlistCount={ wishlistCount }
				accountHref={ accountHref }
			/>
			<CartDrawer isOpen={ overlays.cart } onClose={ closeCart } />
		</>
	);
};

export default SiteHeader;
