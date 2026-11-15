import Icon from '../ui/Icon';
import { useUI } from '../context/UIContext';

/**
 * Icon and badge colour per toast tone.
 */
const TONES = {
	ok:   { icon: 'check', badge: 'bg-emerald-600 text-cream', fill: false },
	love: { icon: 'heart', badge: 'bg-ember text-midnight', fill: true },
	info: { icon: 'info',  badge: 'bg-navy text-cream', fill: false },
	warn: { icon: 'alert', badge: 'bg-rust text-cream', fill: false },
};

/**
 * Toast stack.
 *
 * Bottom-left, at most three at a time, each optionally carrying one action
 * (for example "Undo" after removing a cart line).
 *
 * @return {jsx}
 */
const Toasts = () => {

	const { toasts, dismiss } = useUI();

	return (
		<div
			className="pointer-events-none fixed bottom-4 left-4 right-4 z-50 flex flex-col items-start gap-2 sm:right-auto"
			role="status"
			aria-live="polite"
		>
			{ toasts.map( ( toast ) => {

				const tone = TONES[ toast.tone ] ?? TONES.ok;

				return (
					<div
						key={ toast.id }
						className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-md bg-cream px-4 py-3 text-sm font-semibold text-midnight shadow-2xl shadow-black/40 ring-1 ring-midnight/10 motion-safe:animate-none"
					>
						<span className={ `grid h-8 w-8 shrink-0 place-items-center rounded-full ${ tone.badge }` }>
							<Icon name={ tone.icon } className="h-4 w-4" fill={ tone.fill } />
						</span>

						<span className="flex-1">{ toast.message }</span>

						{ toast.actionLabel && toast.action ? (
							<button
								type="button"
								onClick={ () => {
									toast.action();
									dismiss( toast.id );
								} }
								className="min-h-9 rounded px-2 text-xs font-bold uppercase tracking-widest text-rust underline-offset-4 hover:underline"
							>
								{ toast.actionLabel }
							</button>
						) : null }

						<button
							type="button"
							onClick={ () => dismiss( toast.id ) }
							aria-label="Dismiss notification"
							className="grid h-8 w-8 place-items-center rounded-full text-midnight/60 hover:bg-midnight/10"
						>
							<Icon name="x" className="h-4 w-4" />
						</button>
					</div>
				);
			} ) }
		</div>
	);
};

export default Toasts;
