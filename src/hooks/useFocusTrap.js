import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea,[tabindex]:not([tabindex="-1"])';

/**
 * Shared stack of open traps.
 *
 * Only the topmost trap reacts to keys, so a dialog opened from another dialog
 * (quick view → size guide) closes in the right order.
 */
const stack = [];

/**
 * Trap focus inside a dialog while it is open.
 *
 * Moves focus in on open, cycles Tab within the panel, closes on Escape, and
 * restores focus to the previously active element on close — the behaviour the
 * prototype implements in its `trap()` helper.
 *
 * @param {boolean}  isOpen  Whether the dialog is open.
 * @param {Function} onClose Called on Escape.
 *
 * @return {Object} Ref to attach to the dialog panel.
 */
const useFocusTrap = ( isOpen, onClose ) => {

	const panelRef = useRef( null );
	const onCloseRef = useRef( onClose );

	// Keep the latest handler without re-running the effect on every render.
	useEffect( () => {
		onCloseRef.current = onClose;
	}, [ onClose ] );

	useEffect( () => {

		const panel = panelRef.current;

		if ( ! isOpen || ! panel ) {
			return;
		}

		const token = {};
		stack.push( token );

		const previouslyFocused = document.activeElement;

		const visibleFocusable = () => [ ...panel.querySelectorAll( FOCUSABLE ) ]
			.filter( ( element ) => null !== element.offsetParent );

		// Wait for the open transition so focus lands on a painted element.
		const focusTimer = setTimeout( () => {
			const target = panel.querySelector( '[data-autofocus]' ) || visibleFocusable()[ 0 ] || panel;
			target?.focus?.();
		}, 80 );

		const onKeyDown = ( event ) => {

			if ( stack[ stack.length - 1 ] !== token ) {
				return;
			}

			if ( 'Escape' === event.key ) {
				event.preventDefault();
				onCloseRef.current?.();
				return;
			}

			if ( 'Tab' !== event.key ) {
				return;
			}

			const elements = visibleFocusable();

			if ( ! elements.length ) {
				return;
			}

			const first = elements[ 0 ];
			const last = elements[ elements.length - 1 ];

			if ( event.shiftKey && document.activeElement === first ) {
				event.preventDefault();
				last.focus();
			} else if ( ! event.shiftKey && document.activeElement === last ) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener( 'keydown', onKeyDown );

		return () => {

			clearTimeout( focusTimer );
			document.removeEventListener( 'keydown', onKeyDown );

			const index = stack.indexOf( token );

			if ( index >= 0 ) {
				stack.splice( index, 1 );
			}

			if ( previouslyFocused?.focus && document.contains( previouslyFocused ) ) {
				previouslyFocused.focus();
			}
		};
	}, [ isOpen ] );

	return panelRef;
};

export default useFocusTrap;
