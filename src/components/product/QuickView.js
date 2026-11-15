import { useQuery } from '@apollo/client';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import BuyBox from './BuyBox';
import useFocusTrap from '../../hooks/useFocusTrap';
import { useUI } from '../context/UIContext';
import GET_PRODUCT from '../../queries/get-product';
import { normaliseProduct } from '../../utils/product';
import { decodeHtmlEntities } from '../../functions';

/**
 * Strip tags from WooCommerce's short description.
 *
 * @param {string} html Short description markup.
 *
 * @return {string} Plain text.
 */
const toPlainText = ( html ) => decodeHtmlEntities( ( html ?? '' ).replace( /<[^>]*>/g, ' ' ) )
	.replace( /\s+/g, ' ' )
	.trim();

/**
 * Quick view dialog.
 *
 * Runs the same buy box as the product page in compact mode, so variations,
 * pricing and stock behave identically without leaving the catalog.
 *
 * @return {jsx}
 */
const QuickView = () => {

	const { overlays, closeQuickView } = useUI();
	const slug = overlays.quick;
	const isOpen = !! slug;

	const panelRef = useFocusTrap( isOpen, closeQuickView );

	const { data, loading } = useQuery( GET_PRODUCT, {
		variables: { slug: slug ?? '' },
		skip: ! isOpen,
	} );

	const node = data?.product;
	const product = normaliseProduct( node );

	return (
		<div
			className={ cx(
				'fixed inset-0 z-50 grid place-items-center p-4 transition-all duration-300 motion-reduce:transition-none',
				isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
			) }
			aria-hidden={ isOpen ? 'false' : 'true' }
		>
			<div className="absolute inset-0 bg-midnight/85 backdrop-blur-sm" onClick={ closeQuickView } />

			<div
				ref={ panelRef }
				role="dialog"
				aria-modal="true"
				aria-label="Quick view"
				className={ cx(
					'relative grid max-h-full w-full max-w-4xl overflow-y-auto rounded-lg bg-petrol shadow-2xl transition duration-300 motion-reduce:transition-none md:grid-cols-2',
					isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
				) }
			>
				<button
					type="button"
					onClick={ closeQuickView }
					aria-label="Close quick view"
					className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-rust text-cream transition hover:bg-ember hover:text-midnight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame"
				>
					<Icon name="x" />
				</button>

				<div className="relative aspect-portrait bg-ember md:aspect-auto">
					{ product ? <Img src={ product.image } alt={ product.name } sizes="(min-width: 768px) 50vw, 100vw" /> : null }
				</div>

				<div className="p-6 sm:p-8">
					{ loading || ! product ? (
						<div className="flex animate-pulse flex-col gap-4">
							<div className="h-3 w-24 rounded bg-teal" />
							<div className="h-12 w-3/4 rounded bg-teal" />
							<div className="h-8 w-28 rounded bg-teal" />
							<div className="h-20 w-full rounded bg-teal" />
							<div className="h-12 w-full rounded bg-teal" />
						</div>
					) : (
						<BuyBox
							product={ product }
							variations={ node.variations?.nodes ?? [] }
							shortDescription={ toPlainText( node.shortDescription ) }
							compact
							onAdded={ closeQuickView }
						/>
					) }
				</div>
			</div>
		</div>
	);
};

export default QuickView;
