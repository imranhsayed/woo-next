import { useEffect, useRef, useState } from 'react';

/**
 * Reveal a section once it scrolls into view.
 *
 * Returns a ref for the section and whether it has been revealed. Content that
 * has already appeared stays visible, and anyone who prefers reduced motion
 * gets it visible immediately.
 *
 * @param {number} threshold Fraction of the element that must be visible.
 *
 * @return {[Object, boolean]} Ref and revealed flag.
 */
const useReveal = ( threshold = 0.15 ) => {

	const ref = useRef( null );
	const [ isRevealed, setRevealed ] = useState( false );

	useEffect( () => {

		const element = ref.current;

		if ( ! element ) {
			return;
		}

		const prefersReducedMotion = window.matchMedia?.( '(prefers-reduced-motion: reduce)' ).matches;

		if ( prefersReducedMotion || 'undefined' === typeof IntersectionObserver ) {
			setRevealed( true );
			return;
		}

		// Already in view on load (above the fold, or a restored scroll position).
		if ( element.getBoundingClientRect().top < window.innerHeight * 0.92 ) {
			setRevealed( true );
			return;
		}

		const observer = new IntersectionObserver( ( entries ) => {

			if ( entries.some( ( entry ) => entry.isIntersecting ) ) {
				setRevealed( true );
				observer.disconnect();
			}
		}, { threshold } );

		observer.observe( element );

		return () => observer.disconnect();
	}, [ threshold ] );

	return [ ref, isRevealed ];
};

/**
 * Tailwind classes for the reveal transition.
 *
 * @param {boolean} isRevealed Whether the section has been revealed.
 *
 * @return {string} Utility classes.
 */
export const revealClass = ( isRevealed ) => isRevealed
	? 'opacity-100 translate-y-0'
	: 'opacity-0 translate-y-6';

export default useReveal;
