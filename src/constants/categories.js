/**
 * Catalog landing-page editorial.
 *
 * WooCommerce owns each category's name and blurb (its term description), and
 * its thumbnail. What it cannot hand over through GraphQL is the kicker, the
 * display headline and the second hero frame — term meta is not exposed — so
 * those live here.
 *
 * Images are media-library filenames; `heroImages` is the split-screen pair.
 */
export const CATEGORY_EDITORIAL = {
	women: {
		kicker: 'Women’s wear',
		title: 'Bold by Nature',
		heroImages: [ 'wn-2.webp', 'wn-35.webp' ],
	},
	men: {
		kicker: 'Men’s wear',
		title: 'Retro Tailored',
		heroImages: [ 'wn-38.webp', 'wn-75.webp' ],
	},
	kids: {
		kicker: 'Kid’s wear',
		title: 'Little Legends',
		heroImages: [ 'wn-17.webp', 'wn-94.webp' ],
	},
	accessories: {
		kicker: 'Finishing touches',
		title: 'The Details',
		heroImages: [ 'wn-29.webp', 'wn-26.webp' ],
	},
	'home-living': {
		kicker: 'Home & living',
		title: 'Lounge in Colour',
		heroImages: [ 'wn-31.webp', 'wn-51.webp' ],
	},
	new: {
		kicker: 'Just landed',
		title: 'See What’s New',
		heroImages: [ 'wn-0.webp', 'wn-92.webp' ],
	},
	offers: {
		kicker: 'Limited time',
		title: 'Flat Out Deals',
		heroImages: [ 'wn-3.webp', 'wn-40.webp' ],
	},
};

/** Hero for the full catalog at /shop. */
export const SHOP_EDITORIAL = {
	kicker: 'The full collection',
	title: 'Shop all',
	blurb: 'Every WooNext piece in one place — filter by size, colour and price to find your perfect look.',
	heroImages: [ 'wn-96.webp', 'wn-35.webp' ],
};

/** Hero for search results. */
export const SEARCH_EDITORIAL = {
	kicker: 'Search results',
	heroImages: [ 'wn-62.webp', 'wn-92.webp' ],
};

/**
 * Price bands for the catalog filter.
 *
 * `min` is inclusive, `max` exclusive; `max: null` means no upper bound.
 */
export const PRICE_BANDS = [
	{ id: 'u25',    label: 'Under 25 €',      min: 0,   max: 25 },
	{ id: '25-75',  label: '25 – 75 €',       min: 25,  max: 75 },
	{ id: '75-150', label: '75 – 150 €',      min: 75,  max: 150 },
	{ id: '150',    label: '150 € and above', min: 150, max: null },
];

/** Sort options, in the order the select lists them. */
export const SORT_OPTIONS = [
	{ id: 'relevance',  label: 'Sort: Relevance' },
	{ id: 'newest',     label: 'Newest' },
	{ id: 'popular',    label: 'Most popular' },
	{ id: 'price-asc',  label: 'Price: low to high' },
	{ id: 'price-desc', label: 'Price: high to low' },
];

/** Suggestions offered when a catalog view comes back empty. */
export const EMPTY_STATE_LINKS = [
	{ label: 'Jackets',      href: '/search/jacket' },
	{ label: 'Dresses',      href: '/search/dress' },
	{ label: 'New arrivals', href: '/category/new' },
	{ label: 'Offers',       href: '/category/offers' },
];

/** Products per catalog page. */
export const PRODUCTS_PER_PAGE = 9;

/**
 * Editorial for a category landing page.
 *
 * @param {string} slug Category slug.
 * @param {string} name Category name, used when no editorial is configured.
 *
 * @return {Object} Kicker, title and hero image pair.
 */
export const categoryEditorial = ( slug, name = '' ) => CATEGORY_EDITORIAL[ slug ] ?? {
	kicker: 'Collection',
	title: name,
	heroImages: [],
};
