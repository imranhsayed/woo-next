import Head from "next/head";
import PropTypes from "prop-types";

import AnnouncementBar from "./shell/AnnouncementBar";
import SiteHeader from "./shell/SiteHeader";
import SiteFooter from "./shell/SiteFooter";
import Toasts from "./shell/Toasts";
import QuickView from "./product/QuickView";
import SizeGuideDialog from "./product/SizeGuideDialog";

/**
 * Storefront chrome.
 *
 * Announcement bar, header, footer and the shell overlays. The data and
 * shell-state providers live in `_app` rather than here, so a page can call
 * `useCart` or `useUI` in its own body — those hooks would otherwise run
 * before the provider the page's own JSX renders. Route progress is handled
 * once in `_app` too.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const Layout = ( { children, title = 'WooNext — Step Back Into Style', description = '' } ) => {

	/**
	 * Send focus to the main region.
	 *
	 * The skip link targets `#main` rather than navigating, so the hash does
	 * not end up in the URL.
	 *
	 * @param {Object} event Click event.
	 */
	const skipToContent = ( event ) => {

		event.preventDefault();
		document.getElementById( 'main' )?.focus();
	};

	return (
		<>
			<Head>
				<title>{ title }</title>
				{ description ? <meta name="description" content={ description } /> : null }
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</Head>

			<div className="min-h-screen overflow-x-hidden bg-midnight font-sans text-peach antialiased selection:bg-ember selection:text-midnight">
				<a
					href="#main"
					onClick={ skipToContent }
					className="sr-only z-50 rounded bg-cream px-4 py-2 font-bold text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
				>
					Skip to content
				</a>

				<AnnouncementBar />
				<SiteHeader />

				<main id="main" tabIndex={ -1 } className="focus:outline-none">
					{ children }
				</main>

				<SiteFooter />
				<QuickView />
				<SizeGuideDialog />
				<Toasts />
			</div>
		</>
	);
};

Layout.propTypes = {
	children: PropTypes.node,
	title: PropTypes.string,
	description: PropTypes.string,
};

export default Layout;
