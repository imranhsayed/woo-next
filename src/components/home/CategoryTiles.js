import Link from 'next/link';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import useReveal, { revealClass } from '../../hooks/useReveal';
import { CATEGORY_TILES } from '../../constants/home';
import { editorialImage } from '../../utils/media';

/**
 * Shop-by-category tiles.
 *
 * Three image tiles around a flat "See what's new" panel that takes the second
 * grid slot on desktop and leads on mobile.
 *
 * @return {jsx}
 */
const CategoryTiles = () => {

	const [ ref, isRevealed ] = useReveal();

	return (
		<section
			ref={ ref }
			aria-label="Shop by category"
			className={ cx(
				'mx-auto w-full max-w-7xl px-4 transition duration-500 motion-reduce:transition-none sm:px-6 lg:px-8',
				revealClass( isRevealed )
			) }
		>
			<div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
				{ CATEGORY_TILES.map( ( tile ) => (
					<Link
						key={ tile.href }
						href={ tile.href }
						className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-md bg-ember ring-1 ring-white/10 transition duration-300 hover:ring-flame"
					>
						<Img
							src={ editorialImage( tile.image ) }
							alt=""
							sizes="(min-width: 768px) 25vw, 50vw"
							className="transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
						/>
						<span className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
						<span className="relative flex items-center justify-between gap-2 bg-petrol/90 px-3 py-2.5 backdrop-blur">
							<span className="font-display text-lg uppercase tracking-wide text-cream sm:text-2xl">{ tile.label }</span>
							<span className="grid h-8 w-8 place-items-center rounded-full bg-ember text-midnight transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transform-none">
								<Icon name="arrow-right" className="h-4 w-4" />
							</span>
						</span>
					</Link>
				) ) }

				<Link
					href="/category/new"
					className="group order-first flex aspect-square flex-col justify-between rounded-md bg-teal p-4 ring-1 ring-white/10 transition duration-300 hover:bg-lagoon sm:p-6 md:order-none md:col-start-2 md:row-start-1"
				>
					<span className="font-display text-4xl uppercase leading-none text-cream sm:text-5xl lg:text-6xl">See<br />what’s<br />new</span>
					<span className="flex items-center gap-2">
						<span className="grid h-9 w-9 place-items-center rounded-full text-cream ring-1 ring-cream/60">
							<Icon name="arrow-left" className="h-4 w-4" />
						</span>
						<span className="grid h-9 w-9 place-items-center rounded-full bg-ember text-midnight transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">
							<Icon name="arrow-right" className="h-4 w-4" />
						</span>
					</span>
				</Link>
			</div>
		</section>
	);
};

export default CategoryTiles;
