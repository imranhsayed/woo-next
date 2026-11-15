import { useRef, useState } from 'react';
import cx from 'classnames';

import Icon from '../ui/Icon';
import useReveal, { revealClass } from '../../hooks/useReveal';
import { TESTIMONIALS } from '../../constants/home';

/**
 * Testimonial carousel.
 *
 * A snap-scrolling row — so it stays usable by touch and keyboard without any
 * scripted transform — with arrow controls and dots that follow the scroll
 * position.
 *
 * @return {jsx}
 */
const Testimonials = () => {

	const [ ref, isRevealed ] = useReveal();
	const trackRef = useRef( null );
	const [ active, setActive ] = useState( 0 );

	const total = TESTIMONIALS.length;

	/**
	 * Scroll one slide into view.
	 *
	 * @param {number} index Target slide, wrapping at both ends.
	 */
	const goTo = ( index ) => {

		const track = trackRef.current;

		if ( ! track ) {
			return;
		}

		const next = ( index + total ) % total;
		const slide = track.children[ next ];

		if ( slide ) {
			const prefersReducedMotion = window.matchMedia?.( '(prefers-reduced-motion: reduce)' ).matches;

			track.scrollTo( {
				left: slide.offsetLeft - track.offsetLeft,
				behavior: prefersReducedMotion ? 'auto' : 'smooth',
			} );
		}

		setActive( next );
	};

	/**
	 * Keep the dots in step when the row is scrolled or swiped directly.
	 *
	 * @param {Object} event Scroll event.
	 */
	const onScroll = ( event ) => {

		const track = event.currentTarget;
		const slideWidth = track.children[ 0 ] ? track.children[ 0 ].offsetWidth + 16 : 1;
		const index = Math.min( total - 1, Math.round( track.scrollLeft / slideWidth ) );

		if ( index !== active ) {
			setActive( index );
		}
	};

	return (
		<section
			ref={ ref }
			aria-labelledby="testimonials-title"
			aria-roledescription="carousel"
			className={ cx(
				'mx-auto w-full max-w-7xl px-4 transition duration-500 motion-reduce:transition-none sm:px-6 lg:px-8',
				revealClass( isRevealed )
			) }
		>
			<div className="flex items-end justify-between gap-4">
				<div>
					<p className="text-xs font-bold uppercase tracking-widest text-flame">Testimonials</p>
					<h2 id="testimonials-title" className="font-display text-5xl uppercase leading-none text-cream sm:text-6xl">Loved by our people</h2>
				</div>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={ () => goTo( active - 1 ) }
						aria-label="Previous testimonial"
						className="grid h-12 w-12 place-items-center rounded-full text-cream ring-1 ring-peach/40 transition hover:bg-cream hover:text-midnight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame"
					>
						<Icon name="arrow-left" />
					</button>
					<button
						type="button"
						onClick={ () => goTo( active + 1 ) }
						aria-label="Next testimonial"
						className="grid h-12 w-12 place-items-center rounded-full bg-ember text-midnight transition hover:bg-flame focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame"
					>
						<Icon name="arrow-right" />
					</button>
				</div>
			</div>

			<div className="mt-6 overflow-hidden">
				<div
					ref={ trackRef }
					onScroll={ onScroll }
					className="-mb-6 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-6 motion-reduce:scroll-auto"
				>
					{ TESTIMONIALS.map( ( testimonial, index ) => (
						<figure
							key={ testimonial.name }
							role="group"
							aria-roledescription="slide"
							aria-label={ `${ index + 1 } of ${ total }` }
							className="flex w-full shrink-0 snap-start flex-col items-center justify-center gap-5 rounded-md bg-gradient-to-b from-petrol to-navy px-6 py-12 text-center ring-1 ring-white/10 md:w-1/2 md:shrink-0 lg:px-12"
						>
							<span className="flex gap-1 text-flame" role="img" aria-label={ `${ testimonial.rating } out of 5 stars` }>
								{ [ 1, 2, 3, 4, 5 ].map( ( star ) => (
									<Icon key={ star } name="star" className="h-5 w-5" fill={ star <= testimonial.rating } />
								) ) }
							</span>
							<blockquote className="max-w-md text-xl font-semibold leading-snug text-cream sm:text-2xl">“{ testimonial.text }”</blockquote>
							<figcaption>
								<span className="block text-sm font-bold text-cream">{ testimonial.name }</span>
								<span className="text-xs text-peach/70">{ testimonial.role }</span>
							</figcaption>
						</figure>
					) ) }
				</div>
			</div>

			<div className="mt-4 flex justify-center gap-2">
				{ TESTIMONIALS.map( ( testimonial, index ) => (
					<button
						key={ testimonial.name }
						type="button"
						onClick={ () => goTo( index ) }
						aria-label={ `Go to testimonial ${ index + 1 }` }
						aria-current={ index === active ? 'true' : 'false' }
						className={ cx(
							'h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none',
							index === active ? 'w-8 bg-ember' : 'w-2.5 bg-peach/30 hover:bg-peach/60'
						) }
					/>
				) ) }
			</div>
		</section>
	);
};

export default Testimonials;
