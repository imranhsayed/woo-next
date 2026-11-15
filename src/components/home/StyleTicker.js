import Link from 'next/link';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

import { TICKER } from '../../constants/home';
import { editorialImage } from '../../utils/media';
import { searchHref } from '../../constants/nav';

/** Pixels per frame the ticker drifts. */
const SPEED = 0.6;

/**
 * Auto-scrolling style ticker.
 *
 * The item list is rendered twice so the scroll position can wrap at the
 * halfway point without a visible jump; the duplicate is hidden from assistive
 * technology. Drifting pauses on hover and focus, and does not run at all for
 * anyone who prefers reduced motion.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const StyleTicker = ( { counts = {} } ) => {

	const trackRef = useRef( null );
	const isPaused = useRef( false );

	useEffect( () => {

		const track = trackRef.current;

		if ( ! track || window.matchMedia?.( '(prefers-reduced-motion: reduce)' ).matches ) {
			return;
		}

		let frame;

		const step = () => {

			if ( ! isPaused.current ) {
				track.scrollLeft += SPEED;

				if ( track.scrollLeft >= track.scrollWidth / 2 ) {
					track.scrollLeft -= track.scrollWidth / 2;
				}
			}

			frame = requestAnimationFrame( step );
		};

		frame = requestAnimationFrame( step );

		return () => cancelAnimationFrame( frame );
	}, [] );

	const items = TICKER.map( ( item ) => ( {
		...item,
		href: item.href ?? searchHref( item.search ),
		count: item.href ? ( counts.total ?? 0 ) : ( counts[ item.search ] ?? 0 ),
	} ) );

	// Second pass is purely visual filler for the wrap.
	const track = [
		...items.map( ( item ) => ( { ...item, key: `a-${ item.label }`, isClone: false } ) ),
		...items.map( ( item ) => ( { ...item, key: `b-${ item.label }`, isClone: true } ) ),
	];

	return (
		<section
			aria-label="Browse by style"
			className="border-y border-white/10 bg-navy py-5"
			onMouseEnter={ () => { isPaused.current = true; } }
			onMouseLeave={ () => { isPaused.current = false; } }
			onFocus={ () => { isPaused.current = true; } }
			onBlur={ () => { isPaused.current = false; } }
		>
			<div className="overflow-hidden">
				<div ref={ trackRef } className="-mb-6 flex gap-10 overflow-x-auto px-4 pb-6">
					{ track.map( ( item ) => (
						<Link
							key={ item.key }
							href={ item.href }
							tabIndex={ item.isClone ? -1 : 0 }
							aria-hidden={ item.isClone ? 'true' : undefined }
							className="group flex shrink-0 items-center gap-4"
						>
							<Image
								src={ editorialImage( item.image ) }
								alt=""
								width={ 64 }
								height={ 64 }
								className="h-14 w-14 rounded-md object-cover transition duration-300 group-hover:rotate-6 motion-reduce:transform-none sm:h-16 sm:w-16"
							/>
							<span className="font-display text-6xl uppercase leading-none text-cream transition-colors duration-300 group-hover:text-flame sm:text-7xl">
								{ item.label }
							</span>
							<sup className="text-sm font-bold text-peach/60">({ item.count })</sup>
						</Link>
					) ) }
				</div>
			</div>
		</section>
	);
};

StyleTicker.propTypes = {
	counts: PropTypes.object,
};

export default StyleTicker;
