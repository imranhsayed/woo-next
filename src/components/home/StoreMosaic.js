import Link from 'next/link';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import useReveal, { revealClass } from '../../hooks/useReveal';
import { MOSAIC } from '../../constants/home';
import { editorialImage } from '../../utils/media';

/**
 * Store mosaic.
 *
 * A large women's tile anchors the grid, with the new-arrivals promo panel,
 * a square tile and a wide men's tile filling the rest.
 *
 * @return {jsx}
 */
const StoreMosaic = () => {

	const [ ref, isRevealed ] = useReveal();

	return (
		<section
			ref={ ref }
			aria-label="Shop the stores"
			className={ cx(
				'mx-auto w-full max-w-7xl px-4 transition duration-500 motion-reduce:transition-none sm:px-6 lg:px-8',
				revealClass( isRevealed )
			) }
		>
			<div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
				<Link href={ MOSAIC.women.href } className="group relative col-span-2 row-span-2 min-h-96 overflow-hidden rounded-md bg-ember">
					<Img
						src={ editorialImage( MOSAIC.women.image ) }
						alt=""
						sizes="(min-width: 768px) 50vw, 100vw"
						className="transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
					/>
					<span className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
					<span className="absolute bottom-5 left-5 font-display text-4xl uppercase text-cream">{ MOSAIC.women.label }</span>
					<span className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-ember text-midnight transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transform-none">
						<Icon name="arrow-up-right" />
					</span>
				</Link>

				<Link
					href={ MOSAIC.promo.href }
					className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md bg-petrol p-4 text-center ring-1 ring-white/10 transition hover:bg-teal"
				>
					<span className="text-xs font-bold uppercase tracking-widest text-peach/70">{ MOSAIC.promo.kicker }</span>
					<span className="font-display text-6xl uppercase leading-none text-flame">
						{ MOSAIC.promo.headline[ 0 ] }<br />{ MOSAIC.promo.headline[ 1 ] }
					</span>
					<span className="max-w-xs text-xs leading-relaxed text-peach/80">{ MOSAIC.promo.text }</span>
				</Link>

				<Link href={ MOSAIC.latest.href } className="group relative aspect-square overflow-hidden rounded-md bg-ember">
					<Img
						src={ editorialImage( MOSAIC.latest.image ) }
						alt=""
						sizes="(min-width: 768px) 25vw, 50vw"
						className="transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
					/>
					<span className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
					<span className="absolute bottom-4 left-4 font-display text-2xl uppercase text-cream">{ MOSAIC.latest.label }</span>
					<span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-ember text-midnight transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transform-none">
						<Icon name="arrow-up-right" className="h-4 w-4" />
					</span>
				</Link>

				<Link href={ MOSAIC.men.href } className="group relative col-span-2 min-h-56 overflow-hidden rounded-md bg-ember">
					<Img
						src={ editorialImage( MOSAIC.men.image ) }
						alt=""
						sizes="(min-width: 768px) 50vw, 100vw"
						className="transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
					/>
					<span className="absolute inset-0 bg-gradient-to-r from-rust/70 via-transparent to-transparent" />
					<span className="absolute bottom-5 left-5 font-display text-3xl uppercase text-cream">{ MOSAIC.men.label }</span>
					<span className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-cream text-rust transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transform-none">
						<Icon name="arrow-up-right" />
					</span>
				</Link>
			</div>
		</section>
	);
};

export default StoreMosaic;
