import NextImage from 'next/image';
import PropTypes from 'prop-types';
import cx from 'classnames';

/**
 * Fill image.
 *
 * The prototype's `Img` component always paints an image that covers its
 * positioned parent, which is how every product card, gallery frame and
 * editorial tile is built. This wraps `next/image` in `fill` mode to match,
 * so callers only have to size the parent.
 *
 * The parent must be positioned (`relative`/`absolute`) and sized — usually by
 * one of the `aspect-portrait` / `aspect-tall` / `aspect-wide` tokens.
 *
 * Renders nothing without a `src`, letting the parent's own background colour
 * stand in as the placeholder, exactly as the prototype does.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx|null}
 */
const Img = ( {
	src = '',
	alt = '',
	className = '',
	sizes = '100vw',
	priority = false,
	...rest
} ) => {

	if ( ! src ) {
		return null;
	}

	return (
		<NextImage
			src={ src }
			alt={ alt }
			fill
			sizes={ sizes }
			priority={ priority }
			className={ cx( 'object-cover', className ) }
			{ ...rest }
		/>
	);
};

Img.propTypes = {
	src: PropTypes.string,
	alt: PropTypes.string,
	className: PropTypes.string,
	sizes: PropTypes.string,
	priority: PropTypes.bool,
};

export default Img;
