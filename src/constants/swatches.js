/**
 * Colour swatches.
 *
 * WooCommerce stores the `pa_color` terms by name; GraphQL returns their slugs.
 * Mapping each slug to a Tailwind background keeps the palette a design
 * decision rather than data, exactly as the prototype's SWATCH map did.
 */
export const SWATCHES = {
	rust:     { label: 'Rust',     className: 'bg-rust' },
	teal:     { label: 'Teal',     className: 'bg-teal' },
	navy:     { label: 'Navy',     className: 'bg-navy' },
	cream:    { label: 'Cream',    className: 'bg-cream' },
	black:    { label: 'Black',    className: 'bg-neutral-900' },
	denim:    { label: 'Denim',    className: 'bg-sky-700' },
	orange:   { label: 'Orange',   className: 'bg-ember' },
	pink:     { label: 'Pink',     className: 'bg-pink-300' },
	brown:    { label: 'Brown',    className: 'bg-amber-800' },
	grey:     { label: 'Grey',     className: 'bg-neutral-400' },
	white:    { label: 'White',    className: 'bg-white' },
	burgundy: { label: 'Burgundy', className: 'bg-rose-900' },
	green:    { label: 'Green',    className: 'bg-emerald-700' },
	red:      { label: 'Red',      className: 'bg-red-600' },
	yellow:   { label: 'Yellow',   className: 'bg-yellow-400' },
};

/**
 * Canonical size order.
 *
 * WPGraphQL returns attribute options alphabetically, which puts L before M,
 * so size lists are sorted against this instead.
 */
export const SIZE_ORDER = [
	'xs', 's', 'm', 'l', 'xl',
	'4y', '6y', '8y', '10y',
	'0-6m', '6-12m', '12-18m',
	'38', '39', '40', '41', '42', '43', '44',
];

/**
 * Look up a colour swatch.
 *
 * @param {string} slug Colour term slug.
 *
 * @return {{label: string, className: string}} Swatch, with a neutral fallback.
 */
export const getSwatch = ( slug ) => SWATCHES[ slug ] ?? {
	label: slug.charAt( 0 ).toUpperCase() + slug.slice( 1 ).replace( /-/g, ' ' ),
	className: 'bg-neutral-500',
};

/**
 * Sort size slugs into wearable order.
 *
 * @param {Array} slugs Size term slugs.
 *
 * @return {Array} Sorted copy.
 */
export const sortSizes = ( slugs ) => [ ...slugs ].sort( ( a, b ) => {

	const aIndex = SIZE_ORDER.indexOf( a.toLowerCase() );
	const bIndex = SIZE_ORDER.indexOf( b.toLowerCase() );

	if ( -1 === aIndex && -1 === bIndex ) {
		return a.localeCompare( b, undefined, { numeric: true } );
	}

	return ( -1 === aIndex ? Infinity : aIndex ) - ( -1 === bIndex ? Infinity : bIndex );
} );
