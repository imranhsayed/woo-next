import Link from 'next/link';
import cx from 'classnames';

import Icon from '../ui/Icon';
import useFocusTrap from '../../hooks/useFocusTrap';
import { useUI } from '../context/UIContext';
import { SIZE_GUIDE_NOTE, SIZE_GUIDE_ROWS } from '../../constants/size-guide';

/**
 * Size guide dialog.
 *
 * Opened from the buy box. Lives in the shell beside the other overlays, since
 * its open state is shell state.
 *
 * The table uses ARIA roles over a `<table>` so the rows can be laid out on a
 * CSS grid and stay readable on a narrow screen.
 *
 * @return {jsx}
 */
const SizeGuideDialog = () => {

	const { overlays, closeSizeGuide } = useUI();
	const isOpen = overlays.sizeGuide;

	const panelRef = useFocusTrap( isOpen, closeSizeGuide );

	return (
		<div
			className={ cx(
				'fixed inset-0 z-50 grid place-items-center p-4 transition-all duration-300 motion-reduce:transition-none',
				isOpen ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'
			) }
			aria-hidden={ isOpen ? 'false' : 'true' }
		>
			<div className="absolute inset-0 bg-midnight/85" onClick={ closeSizeGuide } />

			<div
				ref={ panelRef }
				role="dialog"
				aria-modal="true"
				aria-labelledby="size-guide-title"
				className={ cx(
					'relative max-h-full w-full max-w-2xl overflow-y-auto rounded-lg bg-cream p-6 text-midnight shadow-2xl transition duration-300 motion-reduce:transition-none sm:p-8',
					isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
				) }
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<p className="text-xs font-bold uppercase tracking-widest text-rust">Fit help</p>
						<h2 id="size-guide-title" className="font-display text-4xl uppercase">Size guide</h2>
					</div>
					<button
						type="button"
						onClick={ closeSizeGuide }
						aria-label="Close size guide"
						className="grid h-11 w-11 place-items-center rounded-full bg-rust text-cream"
					>
						<Icon name="x" />
					</button>
				</div>

				<div className="mt-6 overflow-x-auto" role="table" aria-label="Body measurements in centimetres">
					<div role="rowgroup">
						<div role="row" className="grid grid-cols-4 gap-2 border-b-2 border-midnight py-2 text-sm font-bold uppercase tracking-wider">
							<span role="columnheader">Size</span>
							<span role="columnheader">Chest</span>
							<span role="columnheader">Waist</span>
							<span role="columnheader">Hips</span>
						</div>
					</div>
					<div role="rowgroup">
						{ SIZE_GUIDE_ROWS.map( ( row ) => (
							<div key={ row.size } role="row" className="grid grid-cols-4 gap-2 border-b border-midnight/15 py-2 text-sm">
								<span role="rowheader" className="font-bold">{ row.size }</span>
								<span role="cell">{ row.chest }</span>
								<span role="cell">{ row.waist }</span>
								<span role="cell">{ row.hips }</span>
							</div>
						) ) }
					</div>
				</div>

				<p className="mt-4 text-sm text-midnight/80">
					{ SIZE_GUIDE_NOTE }{ ' ' }
					<Link href="/page/size-guide" className="font-semibold text-rust underline">Full size guide</Link>
				</p>
			</div>
		</div>
	);
};

export default SizeGuideDialog;
