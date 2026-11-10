import Img from 'next/image';

import PropTypes from 'prop-types';
import cx from 'classnames';
import {DEFAULT_IMG_URL} from "../constants/urls";

/**
 * Image Component.
 * We don't need to add srcSet, as Next js will generate that.
 * @see https://nextjs.org/docs/app/api-reference/components/image
 * @see https://nextjs.org/docs/app/api-reference/components/image#devicesizes
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const Image = ( {
    altText = '',
    title = '',
    sourceUrl = '',
    width,
    height,
    className = 'post__image',
    fill = false,
    sizes = '100vw',
    containerClassNames = '',
    showDefault = true,
    defaultImgUrl = '',
    ...rest
} ) => {

    if ( ! sourceUrl && ! showDefault ) {
        return null;
    }

    const src = sourceUrl || ( showDefault ? ( defaultImgUrl || DEFAULT_IMG_URL ) : '' );
    const alt = altText || title;

    /**
     * If we use fill then, width and height of the image cannot be used,
     * and the image fills the entire width and height of its parent container.
     * That's why we need to wrap our image in a container, give it a height and
     * width, and position it relatively so the image can anchor to it.
     */
    if ( fill ) {
        return (
            <div className={cx( 'relative', containerClassNames ) }>
                <Img
                    alt={alt}
                    src={src}
                    fill
                    sizes={sizes}
                    className={cx( 'object-cover', className )}
                    {...rest}
                />
            </div>
        );
    }

    return (
        <Img
            alt={alt}
            src={src}
            width={width}
            height={height}
            className={className}
            {...rest}
        />
    );
};

Image.propTypes = {
    altText: PropTypes.string,
    title: PropTypes.string,
    sourceUrl: PropTypes.string,
    fill: PropTypes.bool,
    sizes: PropTypes.string,
    showDefault: PropTypes.bool,
    defaultImgUrl: PropTypes.string,
    containerClassNames: PropTypes.string,
    className: PropTypes.string
};

export default Image;
