import { WORDPRESS_URL } from '../constants/urls';

/** Upload folder the storefront's editorial imagery lives in. */
const EDITORIAL_UPLOAD_PATH = '/wp-content/uploads/2026/11';

/**
 * URL for an editorial image in the media library.
 *
 * Section artwork — hero frames, mosaic tiles, the lookbook — is chosen for
 * composition rather than attached to any product, so it is referenced by
 * filename rather than fetched through GraphQL.
 *
 * @param {string} filename File name, e.g. `wn-35.webp`.
 *
 * @return {string} Absolute URL.
 */
export const editorialImage = ( filename ) => `${ WORDPRESS_URL }${ EDITORIAL_UPLOAD_PATH }/${ filename }`;

/**
 * Percentage saved between a regular and a sale price.
 *
 * @param {number} price   Current price.
 * @param {number} regular Pre-sale price.
 *
 * @return {number} Whole-number discount, 0 when there is no saving.
 */
export const discountPercent = ( price, regular ) => {

	if ( ! regular || ! price || regular <= price ) {
		return 0;
	}

	return Math.round( ( 1 - price / regular ) * 100 );
};
