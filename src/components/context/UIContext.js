import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Shell UI state: overlays, toasts and the wishlist.
 *
 * The prototype keeps all of this in one store alongside the cart. Here the
 * cart lives in WooCommerce (see `useCart`), so this context only owns the
 * things that are purely presentational or browser-local.
 */

const OVERLAYS = { search: false, cart: false, nav: false, quick: null, sizeGuide: false };

const WISHLIST_KEY = 'woonext-wishlist';

const RECENT_KEY = 'woonext-recently-viewed';

/** How many recently-viewed products to remember. */
const RECENT_LIMIT = 8;

export const UIContext = createContext( null );

/**
 * Read a JSON array from localStorage.
 *
 * @param {string} key Storage key.
 *
 * @return {Array} Stored array, or an empty one.
 */
const readStoredList = ( key ) => {

	if ( 'undefined' === typeof window ) {
		return [];
	}

	try {
		const stored = JSON.parse( window.localStorage.getItem( key ) || '[]' );
		return Array.isArray( stored ) ? stored : [];
	} catch ( error ) {
		return [];
	}
};

/**
 * Write a list to localStorage, ignoring quota and private-mode failures.
 *
 * @param {string} key  Storage key.
 * @param {Array}  list Value to store.
 */
const writeStoredList = ( key, list ) => {

	try {
		window.localStorage.setItem( key, JSON.stringify( list ) );
	} catch ( error ) {
		// Storage can be unavailable; the in-memory list still works this session.
	}
};

export const UIProvider = ( { children } ) => {

	const [ overlays, setOverlays ] = useState( OVERLAYS );
	const [ toasts, setToasts ] = useState( [] );
	const [ wishlist, setWishlist ] = useState( [] );
	const [ recentlyViewed, setRecentlyViewed ] = useState( [] );

	const timers = useRef( new Map() );
	const nextId = useRef( 0 );

	// Hydrate from storage after mount so server and client markup match.
	useEffect( () => {
		setWishlist( readStoredList( WISHLIST_KEY ) );
		setRecentlyViewed( readStoredList( RECENT_KEY ) );
	}, [] );

	const dismiss = useCallback( ( id ) => {

		setToasts( ( current ) => current.filter( ( toast ) => toast.id !== id ) );

		const timer = timers.current.get( id );

		if ( timer ) {
			clearTimeout( timer );
			timers.current.delete( id );
		}
	}, [] );

	/**
	 * Queue a toast.
	 *
	 * @param {string} message Message to show.
	 * @param {Object} options `tone` (ok|info|love|warn), `actionLabel`, `action`, `ms`.
	 *
	 * @return {number} Toast id, so callers can dismiss it early.
	 */
	const toast = useCallback( ( message, options = {} ) => {

		const id = ++nextId.current;
		const { tone = 'ok', actionLabel = '', action = null, ms = 4200 } = options;

		setToasts( ( current ) => [ ...current.slice( -2 ), { id, message, tone, actionLabel, action } ] );

		timers.current.set( id, setTimeout( () => dismiss( id ), ms ) );

		return id;
	}, [ dismiss ] );

	// Clear pending dismiss timers on unmount.
	useEffect( () => () => {
		timers.current.forEach( ( timer ) => clearTimeout( timer ) );
		timers.current.clear();
	}, [] );

	const setOverlay = useCallback( ( patch ) => setOverlays( ( current ) => ( { ...current, ...patch } ) ), [] );

	const closeAllOverlays = useCallback( () => setOverlays( OVERLAYS ), [] );

	/**
	 * Lock body scroll while any overlay is open.
	 *
	 * `quick` holds a product id rather than a boolean, so test for truthiness
	 * instead of `true`.
	 */
	const anyOverlayOpen = Object.values( overlays ).some( Boolean );

	useEffect( () => {

		document.body.classList.toggle( 'overflow-hidden', anyOverlayOpen );

		return () => document.body.classList.remove( 'overflow-hidden' );
	}, [ anyOverlayOpen ] );

	const toggleWishlist = useCallback( ( productId, productName = 'Item' ) => {

		setWishlist( ( current ) => {

			const isSaved = current.includes( productId );
			const next = isSaved ? current.filter( ( id ) => id !== productId ) : [ ...current, productId ];

			writeStoredList( WISHLIST_KEY, next );

			toast(
				isSaved ? `${ productName } removed from wishlist` : `${ productName } saved to your wishlist`,
				{ tone: isSaved ? 'info' : 'love' }
			);

			return next;
		} );
	}, [ toast ] );

	/**
	 * Remember that a product was viewed.
	 *
	 * Stores slugs rather than IDs so the Recently viewed strip can link
	 * straight through without another lookup.
	 *
	 * @param {string} slug Product slug.
	 */
	const recordView = useCallback( ( slug ) => {

		if ( ! slug ) {
			return;
		}

		setRecentlyViewed( ( current ) => {

			const next = [ slug, ...current.filter( ( item ) => item !== slug ) ].slice( 0, RECENT_LIMIT );

			writeStoredList( RECENT_KEY, next );

			return next;
		} );
	}, [] );

	const value = useMemo( () => ( {
		overlays,
		setOverlay,
		closeAllOverlays,
		openSearch: () => setOverlay( { search: true } ),
		closeSearch: () => setOverlay( { search: false } ),
		openCart: () => setOverlay( { cart: true } ),
		closeCart: () => setOverlay( { cart: false } ),
		openNav: () => setOverlay( { nav: true } ),
		closeNav: () => setOverlay( { nav: false } ),
		openQuickView: ( productId ) => setOverlay( { quick: productId } ),
		closeQuickView: () => setOverlay( { quick: null } ),
		openSizeGuide: () => setOverlay( { sizeGuide: true } ),
		closeSizeGuide: () => setOverlay( { sizeGuide: false } ),
		toasts,
		toast,
		dismiss,
		wishlist,
		wishlistCount: wishlist.length,
		isWishlisted: ( productId ) => wishlist.includes( productId ),
		toggleWishlist,
		recentlyViewed,
		recordView,
	} ), [ overlays, setOverlay, closeAllOverlays, toasts, toast, dismiss, wishlist, toggleWishlist, recentlyViewed, recordView ] );

	return <UIContext.Provider value={ value }>{ children }</UIContext.Provider>;
};

/**
 * Read the shell UI state.
 *
 * @return {Object} UI context value.
 */
export const useUI = () => {

	const context = useContext( UIContext );

	if ( ! context ) {
		throw new Error( 'useUI must be used inside <UIProvider>' );
	}

	return context;
};
