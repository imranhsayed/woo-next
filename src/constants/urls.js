/**
 * WordPress site URL, without a trailing slash.
 *
 * A trailing slash in NEXT_PUBLIC_WORDPRESS_URL would build `//graphql`, which
 * WordPress serves as the homepage HTML rather than the GraphQL endpoint, so
 * normalise it once here instead of at every call site.
 */
export const WORDPRESS_URL = ( process.env.NEXT_PUBLIC_WORDPRESS_URL ?? '' ).replace( /\/+$/, '' );

export const GRAPHQL_URL = `${WORDPRESS_URL}/graphql`;

export const DEFAULT_IMG_URL = 'https://via.placeholder.com/400x225';
export const DEFAULT_CATEGORY_IMG_URL = 'https://via.placeholder.com/416x224';
export const DEFAULT_PRODUCT_HOME_IMG_URL = 'https://via.placeholder.com/308x308';
