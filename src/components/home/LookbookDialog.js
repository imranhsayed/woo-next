import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from '../ui/Icon';
import Img from '../ui/Img';
import useFocusTrap from '../../hooks/useFocusTrap';
import { STORY } from '../../constants/home';
import { editorialImage } from '../../utils/media';

/** How long each lookbook frame holds before advancing. */
const FRAME_MS = 2600;

/** Progress-bar widths, listed so Tailwind keeps them. */
const BAR_WIDTHS = [ 'w-1/4', 'w-2/4', 'w-3/4', 'w-full' ];

/**
 * AW26 lookbook dialog.
 *
 * Cross-fades through the lookbook frames on a timer, with play/pause and a
 * progress bar.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const LookbookDialog = ( { isOpen, onClose } ) => {

	const panelRef = useFocusTrap( isOpen, onClose );

	const [ frame, setFrame ] = useState( 0 );
	const [ isPlaying, setPlaying ] = useState( true );

	const frames = STORY.frames;

	// Restart from the first frame whenever the dialog opens.
	useEffect( () => {

		if ( isOpen ) {
			setFrame( 0 );
			setPlaying( true );
		}
	}, [ isOpen ] );

	useEffect( () => {

		if ( ! isOpen || ! isPlaying ) {
			return;
		}

		const timer = setInterval( () => setFrame( ( current ) => ( current + 1 ) % frames.length ), FRAME_MS );

		return () => clearInterval( timer );
	}, [ isOpen, isPlaying, frames.length ] );

	return (
		<div
			className={ cx(
				'fixed inset-0 z-50 grid place-items-center p-4 transition-all duration-300 motion-reduce:transition-none',
				isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
			) }
			aria-hidden={ isOpen ? 'false' : 'true' }
		>
			<div className="absolute inset-0 bg-midnight/90" onClick={ onClose } />

			<div
				ref={ panelRef }
				role="dialog"
				aria-modal="true"
				aria-label="AW26 lookbook"
				className={ cx(
					'relative w-full max-w-4xl overflow-hidden rounded-lg bg-navy shadow-2xl transition duration-300 motion-reduce:transition-none',
					isOpen ? 'scale-100' : 'scale-95'
				) }
			>
				<div className="relative aspect-wide bg-midnight">
					{ frames.map( ( file, index ) => (
						<Img
							key={ file }
							src={ editorialImage( file ) }
							alt={ index === frame ? `Lookbook frame ${ index + 1 }` : '' }
							sizes="(min-width: 896px) 896px, 100vw"
							className={ cx(
								'transition-opacity duration-500 motion-reduce:transition-none',
								index === frame ? 'opacity-100' : 'opacity-0'
							) }
						/>
					) ) }
					<span className="absolute inset-x-0 bottom-0 h-1 bg-midnight/60">
						<span className={ cx( 'block h-full bg-ember transition-all duration-500 motion-reduce:transition-none', BAR_WIDTHS[ frame ] ) } />
					</span>
				</div>

				<div className="flex items-center justify-between gap-3 p-4">
					<p className="font-display text-2xl uppercase text-cream">
						AW26 lookbook <span className="font-sans text-sm normal-case text-peach/70">· frame { frame + 1 } / { frames.length }</span>
					</p>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={ () => setPlaying( ( playing ) => ! playing ) }
							className="inline-flex min-h-11 items-center rounded-full px-4 text-xs font-bold uppercase tracking-widest text-cream ring-1 ring-peach/40 transition hover:bg-cream hover:text-midnight"
						>
							{ isPlaying ? 'Pause' : 'Play' }
						</button>
						<button
							type="button"
							onClick={ onClose }
							aria-label="Close lookbook"
							className="grid h-11 w-11 place-items-center rounded-full bg-rust text-cream transition hover:bg-ember hover:text-midnight"
						>
							<Icon name="x" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

LookbookDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default LookbookDialog;
