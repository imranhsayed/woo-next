import Link from 'next/link';
import { useEffect, useState } from 'react';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import LookbookDialog from './LookbookDialog';
import useReveal, { revealClass } from '../../hooks/useReveal';
import { STORY } from '../../constants/home';
import { editorialImage } from '../../utils/media';

/**
 * Brand story block.
 *
 * A quarter of tiles — the "Out now" panel, a portrait shot and the lookbook
 * trigger — beside the editorial statement panel.
 *
 * @return {jsx}
 */
const StorySection = () => {

	const [ ref, isRevealed ] = useReveal();
	const [ isFilmOpen, setFilmOpen ] = useState( false );

	// The dialog locks body scroll while open, the same way the shell overlays do.
	useEffect( () => {

		document.body.classList.toggle( 'overflow-hidden', isFilmOpen );

		return () => document.body.classList.remove( 'overflow-hidden' );
	}, [ isFilmOpen ] );

	return (
		<>
			<section
				ref={ ref }
				aria-labelledby="story-title"
				className={ cx(
					'mx-auto w-full max-w-7xl px-4 transition duration-500 motion-reduce:transition-none sm:px-6 lg:px-8',
					revealClass( isRevealed )
				) }
			>
				<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-12">
					<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-5">
						<Link
							href={ STORY.outNow.href }
							className="flex aspect-square flex-col justify-center gap-2 rounded-md bg-petrol p-5 ring-1 ring-white/10 transition hover:bg-teal"
						>
							<span className="text-xs font-bold uppercase tracking-widest text-peach/70">{ STORY.outNow.kicker }</span>
							<span className="font-display text-6xl uppercase leading-none text-cream">
								{ STORY.outNow.title[ 0 ] }<br />{ STORY.outNow.title[ 1 ] }
							</span>
							<span className="text-xs leading-relaxed text-peach/75">{ STORY.outNow.text }</span>
						</Link>

						<Link href={ STORY.portrait.href } className="group relative aspect-square overflow-hidden rounded-md bg-teal">
							<Img
								src={ editorialImage( STORY.portrait.image ) }
								alt={ STORY.portrait.alt }
								sizes="(min-width: 1024px) 20vw, 50vw"
								className="transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
							/>
						</Link>

						<button
							type="button"
							onClick={ () => setFilmOpen( true ) }
							className="group relative col-span-2 aspect-wide overflow-hidden rounded-md bg-teal text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame"
						>
							<Img
								src={ editorialImage( STORY.film.image ) }
								alt=""
								sizes="(min-width: 1024px) 40vw, 100vw"
								className="transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
							/>
							<span className="absolute inset-0 bg-gradient-to-tr from-rust/60 via-transparent to-midnight/40" />
							<span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream text-rust shadow-xl transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none">
								<Icon name="play" className="h-6 w-6" fill />
							</span>
							<span className="absolute bottom-3 left-4 text-xs font-bold uppercase tracking-widest text-cream">{ STORY.film.label }</span>
						</button>
					</div>

					<div className="flex flex-col items-center justify-center gap-6 rounded-md bg-gradient-to-br from-petrol to-navy px-6 py-14 text-center ring-1 ring-white/10 lg:col-span-7">
						<p className="text-xs font-bold uppercase tracking-widest text-peach/70">{ STORY.panel.kicker }</p>
						<h2 id="story-title" className="font-display text-6xl uppercase leading-none text-cream sm:text-7xl">
							<span className="font-script text-6xl normal-case text-peach sm:text-7xl">{ STORY.panel.scriptOne }</span> { STORY.panel.wordOne }{ ' ' }
							<span className="font-script text-6xl normal-case text-peach sm:text-7xl">{ STORY.panel.scriptTwo }</span><br />{ STORY.panel.wordTwo }
						</h2>
						<p className="max-w-md text-sm leading-relaxed text-peach/85">{ STORY.panel.body }</p>
						<Link
							href={ STORY.panel.link.href }
							className="inline-flex min-h-11 items-center rounded-md bg-rust px-6 text-xs font-bold uppercase tracking-widest text-cream ring-2 ring-rust ring-offset-4 ring-offset-navy transition hover:bg-ember hover:text-midnight"
						>
							{ STORY.panel.link.label }
						</Link>
					</div>
				</div>
			</section>

			<LookbookDialog isOpen={ isFilmOpen } onClose={ () => setFilmOpen( false ) } />
		</>
	);
};

export default StorySection;
