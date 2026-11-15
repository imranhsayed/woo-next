import PropTypes from 'prop-types';

/**
 * Circle path helper.
 *
 * The icon set is stroke-only `<path>` data so every glyph can share one
 * `<svg>` wrapper; circles are drawn as two arcs rather than a `<circle>`.
 *
 * @param {number} x Centre x.
 * @param {number} y Centre y.
 * @param {number} r Radius.
 *
 * @return {string} Path data.
 */
const circle = ( x, y, r ) => `M${ x - r } ${ y }a${ r } ${ r } 0 1 0 ${ 2 * r } 0a${ r } ${ r } 0 1 0 ${ -2 * r } 0`;

/**
 * WooNext icon set, ported from the prototype's `Icon.dc.html`.
 *
 * Keys are the names used throughout the storefront markup, so a component can
 * ask for `<Icon name="bag" />` exactly as the prototype did.
 */
export const ICONS = {
	menu: [ 'M4 6h16', 'M4 12h16', 'M4 18h16' ],
	x: [ 'M18 6 6 18', 'M6 6l12 12' ],
	search: [ circle( 11, 11, 8 ), 'm21 21-4.3-4.3' ],
	user: [ 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', circle( 12, 7, 4 ) ],
	heart: [ 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' ],
	bag: [ 'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0' ],
	'arrow-right': [ 'M5 12h14', 'm12 5 7 7-7 7' ],
	'arrow-left': [ 'm12 19-7-7 7-7', 'M19 12H5' ],
	'arrow-up-right': [ 'M7 7h10v10', 'M7 17 17 7' ],
	'chevron-down': [ 'm6 9 6 6 6-6' ],
	'chevron-up': [ 'm18 15-6-6-6 6' ],
	'chevron-left': [ 'm15 18-6-6 6-6' ],
	'chevron-right': [ 'm9 18 6-6-6-6' ],
	plus: [ 'M5 12h14', 'M12 5v14' ],
	minus: [ 'M5 12h14' ],
	trash: [ 'M3 6h18', 'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6', 'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' ],
	truck: [ 'M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2', 'M15 18H9', 'M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14', circle( 17, 18, 2 ), circle( 7, 18, 2 ) ],
	shield: [ 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z', 'm9 12 2 2 4-4' ],
	returns: [ 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5' ],
	gift: [ 'M20 12v10H4V12', 'M2 7h20v5H2z', 'M12 22V7', 'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z', 'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z' ],
	star: [ 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' ],
	play: [ 'M7 4l13 8-13 8V4z' ],
	check: [ 'M20 6 9 17l-5-5' ],
	eye: [ 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z', circle( 12, 12, 3 ) ],
	sliders: [ 'M21 4h-7', 'M10 4H3', 'M21 12h-9', 'M8 12H3', 'M21 20h-5', 'M12 20H3', 'M14 2v4', 'M8 10v4', 'M16 18v4' ],
	instagram: [ 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z', 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z', 'M17.5 6.5h.01' ],
	facebook: [ 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' ],
	twitter: [ 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' ],
	youtube: [ 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17', 'm10 15 5-3-5-3z' ],
	mail: [ 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z', 'm22 6-10 7L2 6' ],
	phone: [ 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z' ],
	pin: [ 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z', circle( 12, 10, 3 ) ],
	package: [ 'm7.5 4.27 9 5.15', 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z', 'm3.3 7 8.7 5 8.7-5', 'M12 22V12' ],
	download: [ 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3' ],
	card: [ 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z', 'M2 10h20' ],
	logout: [ 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9' ],
	lock: [ 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z', 'M7 11V7a5 5 0 0 1 10 0v4' ],
	grid: [ 'M3 3h7v9H3z', 'M14 3h7v5h-7z', 'M14 12h7v9h-7z', 'M3 16h7v5H3z' ],
	alert: [ circle( 12, 12, 10 ), 'M12 8v4', 'M12 16h.01' ],
	info: [ circle( 12, 12, 10 ), 'M12 16v-4', 'M12 8h.01' ],
	zoom: [ circle( 11, 11, 8 ), 'm21 21-4.3-4.3', 'M11 8v6', 'M8 11h6' ],
	ruler: [ 'M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z', 'm14.5 12.5 2-2', 'm11.5 9.5 2-2', 'm8.5 6.5 2-2', 'm17.5 15.5 2-2' ],
	tag: [ 'M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.7 8.7a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z', 'M7.5 7.5h.01' ],
	loader: [ 'M21 12a9 9 0 1 1-6.22-8.56' ],
	clock: [ circle( 12, 12, 10 ), 'M12 6v6l4 2' ],
	home: [ 'm3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10' ],
	sparkle: [ 'M12 3l1.9 5.8L20 10.5l-6.1 1.7L12 18l-1.9-5.8L4 10.5l6.1-1.7z' ],
	quote: [ 'M3 21c3 0 7-1 7-8V5H3v7h4c0 3-1 5-4 5z', 'M14 21c3 0 7-1 7-8V5h-7v7h4c0 3-1 5-4 5z' ],
	edit: [ 'M12 20h9', 'M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z' ],
	copy: [ 'M8 8h12v12H8z', 'M4 16V4h12' ],
};

/**
 * Icon component.
 *
 * Decorative by default — pass a `title` only when the icon is the sole label
 * for a control that has no visible text and no `aria-label` of its own.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const Icon = ( {
	name = 'x',
	className = 'h-5 w-5',
	fill = false,
	strokeWidth = 1.75,
	title = '',
} ) => {

	const paths = ICONS[ name ] || ICONS.x;

	return (
		<svg
			viewBox="0 0 24 24"
			fill={ fill ? 'currentColor' : 'none' }
			stroke="currentColor"
			strokeWidth={ strokeWidth }
			strokeLinecap="round"
			strokeLinejoin="round"
			className={ className }
			role={ title ? 'img' : undefined }
			aria-hidden={ title ? undefined : 'true' }
			focusable="false"
		>
			{ title ? <title>{ title }</title> : null }
			{ paths.map( ( d ) => <path key={ d } d={ d } /> ) }
		</svg>
	);
};

Icon.propTypes = {
	name: PropTypes.string,
	className: PropTypes.string,
	fill: PropTypes.bool,
	strokeWidth: PropTypes.number,
	title: PropTypes.string,
};

export default Icon;
