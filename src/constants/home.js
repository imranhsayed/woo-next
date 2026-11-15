/**
 * Home page editorial content.
 *
 * Copy, section artwork and which products fill which slot. Products are
 * referenced by slug and fetched from WooCommerce at build time; the artwork
 * is referenced by media-library filename, since these frames are chosen for
 * composition and belong to no single product.
 */

export const HERO = {
	script: 'Made from luxurious material',
	titleStart: 'Step back',
	titleAccent: 'into',
	titleEnd: 'style',
	body: 'Explore timeless pieces that blend classic elegance with a modern twist. Embrace iconic styles and discover your perfect look.',
	primary: { label: 'Shop now', href: '/shop' },
	secondary: { label: 'New arrivals', href: '/category/new' },
	badge: { line1: 'New', line2: 'season', season: 'AW26', href: '/category/new' },
	images: [ 'wn-35.webp', 'wn-38.webp' ],
};

export const SERVICES = [
	{ icon: 'truck',   title: 'Worldwide shipping',   text: 'Free over 75 € in the EU' },
	{ icon: 'shield',  title: 'Secured payment',      text: 'Encrypted, trusted checkout' },
	{ icon: 'returns', title: '30 days free returns', text: 'Easy exchanges, no fuss' },
	{ icon: 'gift',    title: 'Surprise gift',        text: 'Gift wrap & cards on request' },
];

export const CATEGORY_TILES = [
	{ label: 'Men’s wear',   href: '/category/men',   image: 'wn-38.webp' },
	{ label: 'Women’s wear', href: '/category/women', image: 'wn-2.webp' },
	{ label: 'Kid’s wear',   href: '/category/kids',  image: 'wn-17.webp' },
];

/**
 * The three editorial hero products.
 *
 * `span` places each one in the four-column grid; the middle slot is the wide
 * feature. `shortName` trims the garment type so the oversized display type
 * fits on one line.
 */
export const FEATURED = [
	{
		slug: 'blake-bravado-jacket',
		shortName: 'Blake Bravado',
		span: 'row-span-1 aspect-tall md:aspect-auto md:min-h-96',
	},
	{
		slug: 'solstice-silk-blouse',
		shortName: 'Solstice Silk',
		span: 'order-first col-span-2 aspect-square md:order-none md:row-span-1 md:aspect-auto md:min-h-96',
	},
	{
		slug: 'phoenix-prestige-blazer',
		shortName: 'Phoenix Prestige',
		span: 'aspect-tall md:aspect-auto md:min-h-96',
	},
];

export const TRENDING = {
	kicker: 'Trending this week',
	title: 'Fresh off the rail',
	link: { label: 'Shop all', href: '/shop' },
	slugs: [ 'solstice-silk-blouse', 'marigold-knit', 'v-neck-t-shirt', 'ember-runner' ],
};

export const STORY = {
	outNow: {
		kicker: 'Featured collection',
		title: [ 'Out', 'now' ],
		text: 'Premium quality, made with fibres chosen for comfort and durability.',
		href: '/category/new',
	},
	portrait: { image: 'wn-0.webp', href: '/product/sunset-tracksuit', alt: 'Model wearing the Sunset Tracksuit' },
	film: { image: 'wn-55.webp', label: 'Play the AW26 lookbook' },
	panel: {
		kicker: 'The introduction',
		scriptOne: 'The',
		wordOne: 'Essence',
		scriptTwo: 'of',
		wordTwo: 'WooNext Harmony',
		body: 'Great style shouldn’t be disposable. We design in small batches, favour durable fabrics and cut silhouettes you’ll reach for season after season. Join us in dressing with intention — bright, bold and built to last.',
		link: { label: 'Learn more', href: '/page/about' },
	},
	/** Lookbook frames, cycled by the film dialog. */
	frames: [ 'wn-35.webp', 'wn-75.webp', 'wn-0.webp', 'wn-92.webp' ],
};

export const BRANDS = [
	{ name: 'Halden & Co', className: 'font-serif italic' },
	{ name: 'MERIDIAN',    className: 'font-display tracking-widest' },
	{ name: 'ostra',       className: 'font-sans font-extrabold lowercase' },
	{ name: 'Velour Club', className: 'font-script text-4xl' },
	{ name: 'NORTHWIND',   className: 'font-mono font-bold' },
];

export const SALE = {
	kicker: 'Limited time offers',
	title: '25% off all fashion favourites — limited time!',
	cta: 'Shop the sale',
	href: '/category/offers',
	image: 'wn-3.webp',
	retro: {
		kicker: 'New collection',
		title: 'Men’s retro collection',
		href: '/category/men',
		image: 'wn-62.webp',
	},
};

export const MOSAIC = {
	women: { label: 'Women’s store', href: '/category/women', image: 'wn-61.webp' },
	promo: {
		kicker: 'New arrivals',
		headline: [ '30%', 'off' ],
		text: 'Our new collection is here — explore the freshest styles that just hit our shelves.',
		href: '/category/new',
	},
	latest: { label: 'Latest store', href: '/category/new', image: 'wn-92.webp' },
	men: { label: 'Men’s store', href: '/category/men', image: 'wn-75.webp' },
};

/**
 * Auto-scrolling style ticker.
 *
 * `count` is the number of matching products, shown as a superscript. It is
 * resolved at build time from the catalog rather than hardcoded.
 */
export const TICKER = [
	{ label: 'Hoodies',  search: 'hoodie',   image: 'wn-62.webp' },
	{ label: 'Fashion',  href: '/shop',      image: 'wn-35.webp' },
	{ label: 'Jacket',   search: 'jacket',   image: 'wn-38.webp' },
	{ label: 'T-Shirt',  search: 't-shirt',  image: 'wn-21.webp' },
	{ label: 'Denim',    search: 'denim',    image: 'wn-79.webp' },
	{ label: 'Sneakers', search: 'sneakers', image: 'wn-86.webp' },
	{ label: 'Knitwear', search: 'knit',     image: 'wn-92.webp' },
];

export const TESTIMONIALS = [
	{
		text: 'Fashion-forward and budget-friendly clothing with an easy-to-use site. Ideal for summer, with a perfect fit that clients appreciate!',
		name: 'Kristin Watson',
		role: 'Stylist, Berlin',
		rating: 5,
	},
	{
		text: 'Trendy and cost-effective apparel with a user-friendly website — offering a fit that customers love and a variety of styles!',
		name: 'Jane Cooper',
		role: 'Nursing assistant, Lyon',
		rating: 5,
	},
	{
		text: 'The Blake Bravado jacket is the best thing in my wardrobe. Delivery was quick and the packaging was lovely.',
		name: 'Marco Diaz',
		role: 'Photographer, Madrid',
		rating: 5,
	},
	{
		text: 'Returns were painless and the exchange arrived in two days. I’ll be back for the knitwear.',
		name: 'Priya Shah',
		role: 'Designer, London',
		rating: 4,
	},
	{
		text: 'Finally a store that gets colour right. The kids’ raincoat survived a whole festival season.',
		name: 'Leo Tanaka',
		role: 'Parent of two, Amsterdam',
		rating: 5,
	},
];

export const FAQS = [
	{
		question: 'How do I place an order?',
		answer: 'Browse the shop, choose your size and colour on the product page, and add it to your bag. When you’re ready, open your bag and select Checkout — you can check out as a guest or sign in to track orders from your account.',
	},
	{
		question: 'Do you offer international shipping?',
		answer: 'We currently ship across the EU, the UK and Switzerland. Delivery times and costs are shown at checkout before you pay. We accept major credit and debit cards, PayPal and bank transfer.',
	},
	{
		question: 'How do I track my order?',
		answer: 'Once your order ships you’ll receive a tracking link by email. You can also enter your order number on our Track Order page or view live status under My Account → Orders.',
	},
	{
		question: 'What should I do if I receive a damaged or incorrect item?',
		answer: 'We’re sorry! Contact us within 14 days with your order number and a photo of the item. We’ll arrange a free return and send a replacement or refund — whichever you prefer.',
	},
	{
		question: 'Can I change or cancel my order?',
		answer: 'Orders can be changed or cancelled while they are still in “Processing”. Get in touch as soon as possible and we’ll do our best to update it before it’s packed.',
	},
];
