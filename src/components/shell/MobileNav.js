import Link from 'next/link';
import { useState } from 'react';
import cx from 'classnames';

import Icon from '../ui/Icon';
import useFocusTrap from '../../hooks/useFocusTrap';

/**
 * Mobile navigation drawer.
 *
 * One row per top-level category, with an expandable chip list of its
 * subcategories, and account / wishlist / track-order actions pinned to the
 * bottom.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const MobileNav = ( { isOpen, onClose, categories = [], wishlistCount = 0, accountHref = '/login' } ) => {

	const panelRef = useFocusTrap( isOpen, onClose );
	const [ expandedSlug, setExpandedSlug ] = useState( null );

	return (
		<div
			className={ cx(
				'fixed inset-0 z-50 transition-all duration-300 lg:hidden motion-reduce:transition-none',
				isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
			) }
			aria-hidden={ isOpen ? 'false' : 'true' }
		>
			<div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" onClick={ onClose } />

			<nav
				ref={ panelRef }
				role="dialog"
				aria-modal="true"
				aria-label="Menu"
				className={ cx(
					'absolute inset-y-0 left-0 flex w-full max-w-sm flex-col overflow-y-auto bg-petrol shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				) }
			>
				<div className="flex items-center justify-between bg-peach px-4 py-3">
					<span className="font-display text-3xl uppercase text-rust">Woo<span className="text-midnight">next</span></span>
					<button
						type="button"
						onClick={ onClose }
						aria-label="Close menu"
						className="grid h-11 w-11 place-items-center rounded-full bg-rust text-cream focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rust/50"
					>
						<Icon name="x" />
					</button>
				</div>

				<ul className="flex flex-col divide-y divide-white/10 px-4">
					{ categories.map( ( category ) => {

						const isExpanded = expandedSlug === category.slug;
						const hasChildren = category.children.length > 0;

						return (
							<li key={ category.slug }>
								<div className="flex items-center">
									<Link
										href={ category.href }
										onClick={ onClose }
										className="flex-1 py-4 font-display text-3xl uppercase tracking-wide text-cream hover:text-flame"
									>
										{ category.name }
									</Link>
									{ hasChildren ? (
										<button
											type="button"
											onClick={ () => setExpandedSlug( isExpanded ? null : category.slug ) }
											aria-expanded={ isExpanded }
											aria-label={ `Show ${ category.name } subcategories` }
											className="grid h-11 w-11 place-items-center rounded-full text-peach ring-1 ring-peach/30"
										>
											<span className={ cx( 'transition-transform duration-300 motion-reduce:transition-none', isExpanded && 'rotate-180' ) }>
												<Icon name="chevron-down" />
											</span>
										</button>
									) : null }
								</div>

								{ hasChildren ? (
									<div className={ cx(
										'overflow-hidden transition-all duration-300 motion-reduce:transition-none',
										isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
									) }>
										<ul className="flex flex-wrap gap-2 pb-4 pl-4 pt-4">
											{ category.children.map( ( child ) => (
												<li key={ child.slug }>
													<Link
														href={ child.href }
														onClick={ onClose }
														className="inline-flex min-h-11 items-center rounded-full px-4 text-sm text-peach ring-1 ring-peach/30 hover:bg-cream hover:text-midnight"
													>
														{ child.name }
													</Link>
												</li>
											) ) }
										</ul>
									</div>
								) : null }
							</li>
						);
					} ) }
				</ul>

				<div className="mt-auto grid grid-cols-2 gap-3 p-4">
					<Link href={ accountHref } onClick={ onClose } className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md text-sm font-bold uppercase tracking-widest text-cream ring-1 ring-peach/40">
						<Icon name="user" className="h-4 w-4" />Account
					</Link>
					<Link href="/wishlist" onClick={ onClose } className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md text-sm font-bold uppercase tracking-widest text-cream ring-1 ring-peach/40">
						<Icon name="heart" className="h-4 w-4" />Wishlist ({ wishlistCount })
					</Link>
					<Link href="/page/track-order" onClick={ onClose } className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-rust text-sm font-bold uppercase tracking-widest text-cream">
						<Icon name="truck" className="h-4 w-4" />Track an order
					</Link>
				</div>
			</nav>
		</div>
	);
};

export default MobileNav;
