import Link from 'next/link';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import { formatPrice } from '../../utils/price';
import { productHref } from '../../constants/nav';

/**
 * Describe the chosen variation, e.g. "Size M · Colour Rust".
 *
 * @param {Object} item Formatted cart line.
 *
 * @return {string} Human-readable variation.
 */
export const variationLabel = ( item ) => {

	const parts = ( item.attributes ?? [] ).map( ( attribute ) => {

		const value = attribute.value.replace( /-/g, ' ' );
		const titled = value.charAt( 0 ).toUpperCase() + value.slice( 1 );

		return 'size' === attribute.name ? `Size ${ titled.toUpperCase() }` : `Colour ${ titled }`;
	} );

	if ( parts.length ) {
		return parts.join( ' · ' );
	}

	return 'One size';
};

/**
 * One row of the cart table.
 *
 * Quantity edits are held locally until the shopper presses "Update cart", so
 * the row shows a pending state rather than firing a request per keystroke.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const CartLineItem = ( { item, quantity, isPending, onQuantityChange, onRemove, disabled = false } ) => {

	const href = item.slug ? productHref( item.slug ) : '/shop';

	return (
		<li className="grid grid-cols-12 items-center gap-4 py-5">
			<div className="col-span-12 flex items-center gap-4 md:col-span-6">
				<Link href={ href } className="relative h-28 w-24 shrink-0 overflow-hidden rounded-md bg-ember">
					<Img
						src={ item.image?.sourceUrl ?? '' }
						alt={ item.name }
						sizes="96px"
						className="transition duration-500 hover:scale-105 motion-reduce:transform-none"
					/>
				</Link>
				<div className="flex flex-col gap-1">
					<Link href={ href } className="font-display text-2xl uppercase leading-tight tracking-wide text-cream hover:text-flame">
						{ item.name }
					</Link>
					<p className="text-sm text-peach/75">{ variationLabel( item ) }</p>
					<button
						type="button"
						onClick={ onRemove }
						disabled={ disabled }
						className="mt-1 inline-flex min-h-9 w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-peach/70 transition-colors hover:text-flame disabled:opacity-50"
					>
						<Icon name="trash" className="h-4 w-4" />Remove
					</button>
				</div>
			</div>

			<p className="col-span-4 text-sm text-peach md:col-span-2">
				<span className="mr-1 text-xs uppercase tracking-widest text-peach/60 md:hidden">Price</span>
				{ formatPrice( item.price ) }
			</p>

			<div className="col-span-4 md:col-span-2">
				<label htmlFor={ `qty-${ item.cartKey }` } className="sr-only">Quantity for { item.name }</label>
				<div className={ cx( 'flex w-fit items-center rounded-md ring-1', isPending ? 'ring-flame' : 'ring-peach/30' ) }>
					<button
						type="button"
						onClick={ () => onQuantityChange( quantity - 1 ) }
						aria-label="Decrease quantity"
						className="grid h-10 w-9 place-items-center text-cream hover:text-flame"
					>
						<Icon name="minus" className="h-3.5 w-3.5" />
					</button>
					<input
						id={ `qty-${ item.cartKey }` }
						type="number"
						inputMode="numeric"
						min="1"
						max="10"
						value={ quantity }
						onChange={ ( event ) => onQuantityChange( event.target.value ) }
						className="h-10 w-10 border-0 bg-transparent p-0 text-center font-bold text-cream focus:outline-none focus:ring-2 focus:ring-flame"
					/>
					<button
						type="button"
						onClick={ () => onQuantityChange( quantity + 1 ) }
						aria-label="Increase quantity"
						className="grid h-10 w-9 place-items-center text-cream hover:text-flame"
					>
						<Icon name="plus" className="h-3.5 w-3.5" />
					</button>
				</div>
				{ isPending ? <p className="mt-1 text-xs font-semibold text-flame">Not yet updated</p> : null }
			</div>

			<p className="col-span-4 text-right font-display text-2xl tracking-wide text-flame md:col-span-2">
				{ item.totalPrice }
			</p>
		</li>
	);
};

CartLineItem.propTypes = {
	item: PropTypes.object.isRequired,
	quantity: PropTypes.number.isRequired,
	isPending: PropTypes.bool,
	onQuantityChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};

export default CartLineItem;
