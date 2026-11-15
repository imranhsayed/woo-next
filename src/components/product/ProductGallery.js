import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import useFocusTrap from '../../hooks/useFocusTrap';

/**
 * Transform origins the zoom snaps to, by pointer position.
 *
 * Listed as literals so Tailwind keeps them; an interpolated class name would
 * be purged from the build.
 */
const ORIGINS = {
	'top-left': 'origin-top-left',
	'top-center': 'origin-top',
	'top-right': 'origin-top-right',
	'center-left': 'origin-left',
	'center-center': 'origin-center',
	'center-right': 'origin-right',
	'bottom-left': 'origin-bottom-left',
	'bottom-center': 'origin-bottom',
	'bottom-right': 'origin-bottom-right',
};

/**
 * Product gallery.
 *
 * Thumbnail rail beside a portrait main image that zooms toward the pointer on
 * hover and opens a full-screen viewer on click.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const ProductGallery = ( { images = [], name, isOnSale = false, isNew = false } ) => {

	const [ index, setIndex ] = useState( 0 );
	const [ origin, setOrigin ] = useState( '' );
	const [ isViewerOpen, setViewerOpen ] = useState( false );

	const viewerRef = useFocusTrap( isViewerOpen, () => setViewerOpen( false ) );

	const total = images.length;
	const current = images[ Math.min( index, Math.max( 0, total - 1 ) ) ];

	useEffect( () => {

		document.body.classList.toggle( 'overflow-hidden', isViewerOpen );

		return () => document.body.classList.remove( 'overflow-hidden' );
	}, [ isViewerOpen ] );

	// Arrow keys page through the viewer.
	useEffect( () => {

		if ( ! isViewerOpen ) {
			return;
		}

		const onKeyDown = ( event ) => {

			if ( 'ArrowRight' === event.key ) {
				setIndex( ( value ) => ( value + 1 ) % total );
			} else if ( 'ArrowLeft' === event.key ) {
				setIndex( ( value ) => ( value - 1 + total ) % total );
			}
		};

		document.addEventListener( 'keydown', onKeyDown );

		return () => document.removeEventListener( 'keydown', onKeyDown );
	}, [ isViewerOpen, total ] );

	/**
	 * Track the pointer so the zoom grows from the part being inspected.
	 *
	 * @param {Object} event Mouse move event.
	 */
	const onMouseMove = ( event ) => {

		const bounds = event.currentTarget.getBoundingClientRect();
		const x = ( event.clientX - bounds.left ) / bounds.width;
		const y = ( event.clientY - bounds.top ) / bounds.height;

		const horizontal = x < 0.33 ? 'left' : x > 0.66 ? 'right' : 'center';
		const vertical = y < 0.33 ? 'top' : y > 0.66 ? 'bottom' : 'center';

		setOrigin( ORIGINS[ `${ vertical }-${ horizontal }` ] ?? '' );
	};

	if ( ! total ) {
		return <div className="aspect-portrait flex-1 rounded-md bg-teal" />;
	}

	return (
		<>
			<div className="flex flex-col-reverse gap-3 sm:flex-row lg:col-span-7">
				{ total > 1 ? (
					<ul className="flex gap-3 sm:flex-col" aria-label="Product images">
						{ images.map( ( image, position ) => (
							<li key={ image.sourceUrl }>
								<button
									type="button"
									onClick={ () => setIndex( position ) }
									aria-label={ `Show image ${ position + 1 }` }
									aria-current={ position === index ? 'true' : 'false' }
									className={ cx(
										'relative block h-24 w-20 overflow-hidden rounded-md ring-2 transition duration-200 focus-visible:outline-none focus-visible:ring-flame',
										position === index ? 'ring-ember' : 'ring-transparent opacity-70 hover:opacity-100'
									) }
								>
									<Img src={ image.sourceUrl } alt="" sizes="80px" />
								</button>
							</li>
						) ) }
					</ul>
				) : null }

				<div className="relative flex-1 overflow-hidden rounded-md bg-teal">
					<button
						type="button"
						onClick={ () => setViewerOpen( true ) }
						onMouseMove={ onMouseMove }
						onMouseLeave={ () => setOrigin( '' ) }
						aria-label={ `Open image ${ index + 1 } in full screen` }
						className="group relative block aspect-portrait w-full cursor-zoom-in overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-flame"
					>
						<Img
							src={ current.sourceUrl }
							alt={ `${ name } — image ${ index + 1 }` }
							priority
							sizes="(min-width: 1024px) 50vw, 100vw"
							className={ cx(
								'transition-transform duration-300 ease-out motion-reduce:transition-none',
								origin ? `scale-150 ${ origin }` : 'scale-100'
							) }
						/>
					</button>

					<span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-midnight/70 px-3 py-2 text-xs font-bold uppercase tracking-widest text-cream backdrop-blur">
						<Icon name="zoom" className="h-4 w-4" />Hover to zoom · click to enlarge
					</span>

					<div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-2">
						{ isOnSale ? <span className="rounded bg-ember px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-midnight">Sale</span> : null }
						{ isNew ? <span className="rounded bg-cream px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-midnight">New</span> : null }
					</div>
				</div>
			</div>

			<div
				className={ cx(
					'fixed inset-0 z-50 flex items-center justify-center bg-midnight/95 p-4 transition-all duration-300 motion-reduce:transition-none',
					isViewerOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
				) }
				aria-hidden={ isViewerOpen ? 'false' : 'true' }
			>
				<div
					ref={ viewerRef }
					role="dialog"
					aria-modal="true"
					aria-label="Image viewer"
					className={ cx(
						'relative flex h-full w-full max-w-5xl flex-col items-center justify-center gap-4 transition duration-300 motion-reduce:transition-none',
						isViewerOpen ? 'scale-100' : 'scale-95'
					) }
				>
					<button
						type="button"
						onClick={ () => setViewerOpen( false ) }
						aria-label="Close image viewer"
						className="absolute right-0 top-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-rust text-cream hover:bg-ember hover:text-midnight"
					>
						<Icon name="x" className="h-6 w-6" />
					</button>

					{ /* Unconstrained height, so `next/image` gets explicit dimensions
					     rather than a fill parent. */ }
					<Image
						src={ current.sourceUrl }
						alt={ `${ name } — enlarged image ${ index + 1 }` }
						width={ 1200 }
						height={ 1600 }
						sizes="(min-width: 1024px) 1024px, 100vw"
						className="max-h-full w-auto rounded-md object-contain"
					/>

					<div className="flex items-center gap-4">
						<button
							type="button"
							onClick={ () => setIndex( ( value ) => ( value - 1 + total ) % total ) }
							aria-label="Previous image"
							className="grid h-12 w-12 place-items-center rounded-full text-cream ring-1 ring-peach/40 hover:bg-cream hover:text-midnight"
						>
							<Icon name="arrow-left" />
						</button>
						<span className="text-sm font-bold text-peach">{ index + 1 } / { total }</span>
						<button
							type="button"
							onClick={ () => setIndex( ( value ) => ( value + 1 ) % total ) }
							aria-label="Next image"
							className="grid h-12 w-12 place-items-center rounded-full bg-ember text-midnight hover:bg-flame"
						>
							<Icon name="arrow-right" />
						</button>
					</div>
				</div>
			</div>
		</>
	);
};

ProductGallery.propTypes = {
	images: PropTypes.array,
	name: PropTypes.string.isRequired,
	isOnSale: PropTypes.bool,
	isNew: PropTypes.bool,
};

export default ProductGallery;
