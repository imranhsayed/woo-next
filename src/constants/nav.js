/**
 * Shell navigation configuration.
 *
 * Category names, images and blurbs all come from WooCommerce. What lives here
 * is only the editorial arrangement the prototype specifies: which categories
 * appear in the header bar, how the top level is ordered, and the static link
 * columns in the footer.
 */

/**
 * Top-level category display order.
 *
 * WooCommerce stores this as the `order` term meta (seeded from the
 * prototype), but WPGraphQL does not expose term meta by default, so the order
 * is mirrored here. Categories not listed fall to the end, alphabetically.
 */
export const CATEGORY_ORDER = [ 'women', 'men', 'kids', 'accessories', 'home-living', 'new', 'offers' ];

/**
 * Top-level links in the header bar.
 *
 * Which categories get a slot — and their labels — is an editorial choice, so
 * they ship with the markup and render on the server. The live category name
 * from WooCommerce replaces the label once the nav query resolves.
 */
export const HEADER_NAV = [
	{ slug: 'women', label: 'Women' },
	{ slug: 'men', label: 'Men' },
	{ slug: 'kids', label: 'Kids' },
	{ slug: 'home-living', label: 'Home & Living' },
	{ slug: 'offers', label: 'Offers' },
];

/** Categories shown as columns in the "Categories" mega menu. */
export const MEGA_MENU_CATEGORIES = [ 'women', 'men', 'kids', 'accessories', 'home-living' ];

/** Category slugs the mega menu and search overlay promote. */
export const PROMO_CATEGORIES = { new: 'new', offers: 'offers' };

export const ANNOUNCEMENT = {
	text: 'Free standard shipping over 75 € · 30-day free returns',
	highlight: 'Demo store — payments are simulated',
};

/** Subtotal (in store currency) that unlocks free standard shipping. */
export const FREE_SHIPPING_THRESHOLD = 75;

export const SUGGESTED_SEARCHES = [ 'Leather jacket', 'Silk', 'Sneakers', 'Denim', 'Knit', 'Sunglasses' ];

export const FOOTER_PILLS = [
	{ label: 'Home', href: '/' },
	{ label: 'Men’s', href: '/category/men' },
	{ label: 'Women’s', href: '/category/women' },
	{ label: 'Kid’s', href: '/category/kids' },
];

export const SOCIAL_LINKS = [
	{ label: 'Instagram', icon: 'instagram', href: '/page/contact' },
	{ label: 'Facebook', icon: 'facebook', href: '/page/contact' },
	{ label: 'X', icon: 'twitter', href: '/page/contact' },
	{ label: 'YouTube', icon: 'youtube', href: '/page/contact' },
];

export const FOOTER_COLUMNS = [
	{
		title: 'Shop',
		links: [
			{ label: 'Women', href: '/category/women' },
			{ label: 'Men', href: '/category/men' },
			{ label: 'Kids', href: '/category/kids' },
			{ label: 'Accessories', href: '/category/accessories' },
			{ label: 'Home & Living', href: '/category/home-living' },
			{ label: 'Offers', href: '/category/offers' },
		],
	},
	{
		title: 'Help',
		links: [
			{ label: 'FAQ', href: '/page/faq' },
			{ label: 'Shipping & delivery', href: '/page/shipping' },
			{ label: 'Returns & refunds', href: '/page/returns' },
			{ label: 'Size guide', href: '/page/size-guide' },
			{ label: 'Track your order', href: '/page/track-order' },
		],
	},
	{
		title: 'Company',
		links: [
			{ label: 'About WooNext', href: '/page/about' },
			{ label: 'Contact us', href: '/page/contact' },
			{ label: 'Privacy policy', href: '/page/privacy' },
			{ label: 'Terms & conditions', href: '/page/terms' },
		],
	},
	{
		title: 'Account',
		links: [
			{ label: 'Sign in', href: '/login' },
			{ label: 'Register', href: '/register' },
			{ label: 'Orders', href: '/account/orders' },
			{ label: 'Wishlist', href: '/wishlist' },
			{ label: 'Cart', href: '/cart' },
		],
	},
];

export const FOOTER_LEGAL_LINKS = [
	{ label: 'Privacy policy', href: '/page/privacy' },
	{ label: 'Terms & conditions', href: '/page/terms' },
	{ label: 'Shipping', href: '/page/shipping' },
	{ label: 'Returns', href: '/page/returns' },
];

export const PAYMENT_METHODS = [ 'VISA', 'Mastercard', 'PayPal', 'Apple Pay', 'Klarna' ];

/**
 * Build the URL for a product category.
 *
 * Subcategories are real terms with parent-prefixed slugs (`women-tops`), so
 * one route serves both levels.
 *
 * @param {string} slug Category slug.
 *
 * @return {string} Route path.
 */
export const categoryHref = ( slug ) => `/category/${ slug }`;

/**
 * Build the URL for a product.
 *
 * @param {string} slug Product slug.
 *
 * @return {string} Route path.
 */
export const productHref = ( slug ) => `/product/${ slug }`;

/**
 * Build the URL for a search results page.
 *
 * @param {string} query Search term.
 *
 * @return {string} Route path.
 */
export const searchHref = ( query ) => `/search/${ encodeURIComponent( query ) }`;
