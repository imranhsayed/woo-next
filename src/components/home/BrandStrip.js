import cx from 'classnames';

import { BRANDS } from '../../constants/home';

/**
 * Stocked-brands strip.
 *
 * Each name is set in a different face so the row reads as a row of logos
 * rather than a list, which is how the prototype treats it.
 *
 * @return {jsx}
 */
const BrandStrip = () => (
	<section aria-label="Brands we stock" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<ul className="grid grid-cols-2 items-center gap-6 rounded-md bg-teal px-6 py-8 text-center sm:grid-cols-3 lg:grid-cols-5">
			{ BRANDS.map( ( brand ) => (
				<li key={ brand.name } className={ cx( 'text-2xl text-lagoon transition-colors duration-300 hover:text-peach', brand.className ) }>
					{ brand.name }
				</li>
			) ) }
		</ul>
	</section>
);

export default BrandStrip;
