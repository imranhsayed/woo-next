import Link from 'next/link';
import { useEffect, useState } from 'react';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import useReveal, { revealClass } from '../../hooks/useReveal';
import { SALE } from '../../constants/home';
import { editorialImage } from '../../utils/media';

/**
 * Milliseconds remaining until the offer window closes.
 *
 * The sale runs to the end of the current week, so the target is the next
 * midnight Sunday — recomputed on each tick rather than fixed, so the banner
 * stays correct for a page that was generated days ago.
 *
 * @return {number} Milliseconds remaining.
 */
const millisecondsLeft = () => {

	const now = new Date();
	const end = new Date( now );

	end.setDate( end.getDate() + ( ( 7 - end.getDay() ) % 7 || 7 ) );
	end.setHours( 0, 0, 0, 0 );

	return Math.max( 0, end.getTime() - now.getTime() );
};

/**
 * Split a duration into padded day / hour / minute / second parts.
 *
 * @param {number} milliseconds Duration.
 *
 * @return {Array} Parts with a label and a two-digit value.
 */
const countdownParts = ( milliseconds ) => {

	const seconds = milliseconds / 1000;

	return [
		{ label: 'Days', value: Math.floor( seconds / 86400 ) },
		{ label: 'Hrs',  value: Math.floor( ( seconds % 86400 ) / 3600 ) },
		{ label: 'Min',  value: Math.floor( ( seconds % 3600 ) / 60 ) },
		{ label: 'Sec',  value: Math.floor( seconds % 60 ) },
	].map( ( part ) => ( { ...part, value: String( part.value ).padStart( 2, '0' ) } ) );
};

/**
 * Sale banner with its countdown, beside the men's collection tile.
 *
 * @return {jsx}
 */
const SaleBanner = () => {

	const [ ref, isRevealed ] = useReveal();

	/**
	 * The countdown is clock-dependent, so it stays empty for the server render
	 * and the first client paint; otherwise the two would disagree.
	 */
	const [ remaining, setRemaining ] = useState( null );

	useEffect( () => {

		setRemaining( millisecondsLeft() );

		const timer = setInterval( () => setRemaining( millisecondsLeft() ), 1000 );

		return () => clearInterval( timer );
	}, [] );

	const parts = null === remaining ? [] : countdownParts( remaining );
	const countdownLabel = parts.map( ( part ) => `${ part.value } ${ part.label }` ).join( ' ' );

	return (
		<section
			ref={ ref }
			aria-labelledby="sale-title"
			className={ cx(
				'mx-auto w-full max-w-7xl px-4 transition duration-500 motion-reduce:transition-none sm:px-6 lg:px-8',
				revealClass( isRevealed )
			) }
		>
			<div className="grid gap-3 sm:gap-4 md:grid-cols-3">
				<Link
					href={ SALE.href }
					className="group relative flex min-h-96 flex-col items-center overflow-hidden rounded-md bg-ember px-6 pt-10 text-center md:col-span-2"
				>
					<Img
						src={ editorialImage( SALE.image ) }
						alt=""
						sizes="(min-width: 768px) 66vw, 100vw"
						className="opacity-90 mix-blend-multiply transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
					/>
					<span className="absolute inset-0 bg-gradient-to-b from-rust/80 via-transparent to-midnight/60" />

					<span className="relative text-xs font-bold uppercase tracking-widest text-cream">{ SALE.kicker }</span>
					<h2 id="sale-title" className="relative mt-2 max-w-xl font-display text-5xl uppercase leading-none text-cream sm:text-6xl">
						{ SALE.title }
					</h2>

					<span className="relative mt-6 flex gap-2" aria-label={ countdownLabel ? `Offer ends in ${ countdownLabel }` : 'Offer countdown' }>
						{ parts.map( ( part ) => (
							<span key={ part.label } className="flex w-16 flex-col items-center rounded-md bg-midnight/70 py-2 backdrop-blur">
								<span className="font-display text-3xl text-cream">{ part.value }</span>
								<span className="text-xs uppercase tracking-widest text-peach/80">{ part.label }</span>
							</span>
						) ) }
					</span>

					<span className="relative mb-8 mt-auto inline-flex min-h-12 items-center gap-3 rounded-md bg-cream px-6 text-sm font-bold uppercase tracking-widest text-midnight transition group-hover:bg-midnight group-hover:text-cream">
						{ SALE.cta }
						<Icon name="arrow-right" className="h-4 w-4" />
					</span>
				</Link>

				<Link href={ SALE.retro.href } className="group relative flex min-h-96 flex-col overflow-hidden rounded-md bg-ember p-6 text-center">
					<Img
						src={ editorialImage( SALE.retro.image ) }
						alt=""
						sizes="(min-width: 768px) 33vw, 100vw"
						className="transition duration-500 group-hover:scale-105 motion-reduce:transform-none"
					/>
					<span className="absolute inset-0 bg-gradient-to-b from-ember/70 via-transparent to-transparent" />
					<span className="relative text-xs font-bold uppercase tracking-widest text-midnight">{ SALE.retro.kicker }</span>
					<span className="relative font-display text-5xl uppercase leading-none text-cream">{ SALE.retro.title }</span>
					<span className="absolute bottom-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-cream text-rust transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transform-none">
						<Icon name="arrow-right" />
					</span>
				</Link>
			</div>
		</section>
	);
};

export default SaleBanner;
