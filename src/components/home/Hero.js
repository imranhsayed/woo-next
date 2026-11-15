import Link from 'next/link';
import { useEffect, useState } from 'react';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import { HERO } from '../../constants/home';
import { editorialImage } from '../../utils/media';

/**
 * Full-height hero.
 *
 * Split-screen imagery behind two gradient washes, with the script line,
 * display headline and calls to action easing in on a short stagger.
 *
 * @return {jsx}
 */
const Hero = () => {

	const [ hasEntered, setEntered ] = useState( false );

	// One frame after mount so the transition has a start state to animate from.
	useEffect( () => {

		const timer = setTimeout( () => setEntered( true ), 60 );

		return () => clearTimeout( timer );
	}, [] );

	const imageClass = hasEntered ? 'scale-100 opacity-100' : 'scale-105 opacity-0';

	return (
		<section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-petrol">
			<div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
				<div className="relative h-full w-full">
					<Img
						src={ editorialImage( HERO.images[ 0 ] ) }
						alt=""
						priority
						sizes="(min-width: 768px) 50vw, 100vw"
						className={ cx( 'transition duration-700 ease-out motion-reduce:transition-none', imageClass ) }
					/>
				</div>
				<div className="relative hidden h-full w-full md:block">
					<Img
						src={ editorialImage( HERO.images[ 1 ] ) }
						alt=""
						priority
						sizes="50vw"
						className={ cx( 'transition delay-150 duration-700 ease-out motion-reduce:transition-none', imageClass ) }
					/>
				</div>
			</div>

			<div className="absolute inset-0 bg-gradient-to-r from-midnight/90 via-petrol/40 to-midnight/30" />
			<div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent" />

			<div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end gap-6 px-4 pb-16 pt-32 sm:px-6 lg:min-h-0 lg:px-8 lg:pb-24 lg:pt-56">
				<p className={ cx(
					'font-script text-4xl text-peach transition duration-500 motion-reduce:transition-none sm:text-5xl',
					hasEntered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
				) }>
					{ HERO.script }
				</p>

				<h1
					id="hero-title"
					className={ cx(
						'max-w-5xl font-display text-7xl uppercase leading-none tracking-tight text-cream transition delay-100 duration-500 motion-reduce:transition-none sm:text-8xl sm:leading-none lg:text-giant lg:leading-none',
						hasEntered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
					) }
				>
					{ HERO.titleStart } <span className="text-flame">{ HERO.titleAccent }</span> { HERO.titleEnd }
				</h1>

				<div className={ cx(
					'flex flex-col gap-6 transition delay-200 duration-500 motion-reduce:transition-none sm:flex-row sm:items-end sm:justify-between',
					hasEntered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
				) }>
					<div className="flex max-w-md flex-col gap-5">
						<p className="text-base leading-relaxed text-peach/90">{ HERO.body }</p>
						<div className="flex flex-wrap gap-3">
							<Link
								href={ HERO.primary.href }
								className="group inline-flex min-h-12 items-center gap-3 rounded-md bg-rust px-6 text-sm font-bold uppercase tracking-widest text-cream ring-2 ring-rust ring-offset-4 ring-offset-transparent transition duration-200 hover:bg-ember hover:text-midnight hover:ring-ember focus-visible:outline-none focus-visible:ring-flame"
							>
								{ HERO.primary.label }
								<span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none">
									<Icon name="arrow-right" className="h-4 w-4" />
								</span>
							</Link>
							<Link
								href={ HERO.secondary.href }
								className="inline-flex min-h-12 items-center rounded-md px-6 text-sm font-bold uppercase tracking-widest text-cream ring-1 ring-cream/50 transition duration-200 hover:bg-cream hover:text-midnight"
							>
								{ HERO.secondary.label }
							</Link>
						</div>
					</div>

					<Link
						href={ HERO.badge.href }
						aria-label="New season collection"
						className="group relative grid h-32 w-32 shrink-0 place-items-center self-end rounded-full bg-rust text-center ring-4 ring-peach/80 ring-offset-4 ring-offset-rust transition duration-300 hover:rotate-12 motion-reduce:transform-none sm:h-36 sm:w-36"
					>
						<span className="absolute inset-2 rounded-full border-2 border-dashed border-cream/50" />
						<span className="flex flex-col items-center gap-1 text-cream">
							<Icon name="bag" className="h-7 w-7" />
							<span className="font-display text-lg uppercase leading-none">{ HERO.badge.line1 }<br />{ HERO.badge.line2 }</span>
							<span className="text-xs font-bold tracking-wider">{ HERO.badge.season }</span>
						</span>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Hero;
