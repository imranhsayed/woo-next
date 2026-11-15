import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from '../ui/Icon';
import useFocusTrap from '../../hooks/useFocusTrap';
import { PRICE_BANDS } from '../../constants/categories';

/**
 * Catalog filter panel.
 *
 * A static sidebar from `lg` up, and a slide-in dialog below it — one set of
 * controls either way, so filter state never diverges between breakpoints.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const FilterSidebar = ( {
	facets,
	filters,
	toggle,
	update,
	clearAll,
	groupLegend = 'Category',
	isOpen,
	onClose,
	resultCount,
	uid,
} ) => {

	const panelRef = useFocusTrap( isOpen, onClose );

	return (
		<>
			<div
				className={ cx(
					'fixed inset-0 z-50 bg-midnight/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden motion-reduce:transition-none',
					isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
				) }
				onClick={ onClose }
				aria-hidden="true"
			/>

			<aside
				ref={ panelRef }
				aria-label="Product filters"
				role={ isOpen ? 'dialog' : undefined }
				aria-modal={ isOpen ? 'true' : undefined }
				className={ cx(
					'fixed inset-y-0 left-0 z-50 flex w-full max-w-xs flex-col overflow-y-auto bg-petrol transition-transform duration-300 ease-out motion-reduce:transition-none lg:visible lg:static lg:z-auto lg:w-64 lg:max-w-none lg:shrink-0 lg:translate-x-0 lg:overflow-visible lg:bg-transparent',
					isOpen ? 'visible translate-x-0' : 'invisible -translate-x-full'
				) }
			>
				<div className="flex items-center justify-between border-b border-white/10 p-4 lg:hidden">
					<h2 className="font-display text-3xl uppercase text-cream">Filters</h2>
					<button
						type="button"
						onClick={ onClose }
						aria-label="Close filters"
						className="grid h-11 w-11 place-items-center rounded-full bg-rust text-cream"
					>
						<Icon name="x" />
					</button>
				</div>

				<div className="flex flex-col gap-7 p-4 lg:sticky lg:top-28 lg:p-0">
					{ facets.groups.length ? (
						<fieldset>
							<legend className="mb-3 font-display text-xl uppercase tracking-wide text-cream">{ groupLegend }</legend>
							<ul className="flex flex-col gap-1">
								{ facets.groups.map( ( group ) => (
									<li key={ group.slug }>
										<label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-peach transition-colors hover:text-cream">
											<input
												type="checkbox"
												checked={ group.isActive }
												onChange={ () => toggle( 'groups', group.slug ) }
												className="h-5 w-5 rounded border-peach/40 bg-transparent text-ember focus:ring-flame focus:ring-offset-0"
											/>
											<span className="flex-1">{ group.name }</span>
											<span className="text-xs text-peach/60">{ group.count }</span>
										</label>
									</li>
								) ) }
							</ul>
						</fieldset>
					) : null }

					{ facets.sizes.length ? (
						<fieldset>
							<legend className="mb-3 font-display text-xl uppercase tracking-wide text-cream">Size</legend>
							<div className="flex flex-wrap gap-2">
								{ facets.sizes.map( ( size ) => (
									<button
										key={ size.slug }
										type="button"
										onClick={ () => toggle( 'sizes', size.slug ) }
										aria-pressed={ size.isActive }
										className={ cx(
											'min-h-10 min-w-12 rounded-md px-2 text-sm font-bold ring-1 transition duration-200',
											size.isActive ? 'bg-ember text-midnight ring-ember' : 'text-cream ring-peach/30 hover:ring-cream'
										) }
									>
										{ size.label }
									</button>
								) ) }
							</div>
						</fieldset>
					) : null }

					{ facets.colors.length ? (
						<fieldset>
							<legend className="mb-3 font-display text-xl uppercase tracking-wide text-cream">Colour</legend>
							<div className="flex flex-wrap gap-2">
								{ facets.colors.map( ( color ) => (
									<button
										key={ color.slug }
										type="button"
										onClick={ () => toggle( 'colors', color.slug ) }
										aria-pressed={ color.isActive }
										aria-label={ color.label }
										title={ color.label }
										className={ cx(
											'grid h-10 w-10 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-petrol transition duration-200 lg:ring-offset-midnight',
											color.isActive ? 'ring-ember' : 'ring-transparent hover:ring-peach/40'
										) }
									>
										<span className={ cx( 'h-7 w-7 rounded-full ring-1 ring-white/20', color.className ) } />
									</button>
								) ) }
							</div>
						</fieldset>
					) : null }

					<fieldset>
						<legend className="mb-3 font-display text-xl uppercase tracking-wide text-cream">Price</legend>
						<ul className="flex flex-col gap-1">
							{ [ { id: '', label: 'Any price' }, ...PRICE_BANDS ].map( ( band ) => (
								<li key={ band.id || 'any' }>
									<label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-peach hover:text-cream">
										<input
											type="radio"
											name={ `price-${ uid }` }
											checked={ filters.price === band.id }
											onChange={ () => update( { price: band.id } ) }
											className="h-5 w-5 border-peach/40 bg-transparent text-ember focus:ring-flame focus:ring-offset-0"
										/>
										{ band.label }
									</label>
								</li>
							) ) }
						</ul>
					</fieldset>

					<fieldset>
						<legend className="mb-3 font-display text-xl uppercase tracking-wide text-cream">Availability</legend>
						<label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-peach hover:text-cream">
							<input
								type="checkbox"
								checked={ filters.inStock }
								onChange={ () => update( { inStock: ! filters.inStock } ) }
								className="h-5 w-5 rounded border-peach/40 bg-transparent text-ember focus:ring-flame focus:ring-offset-0"
							/>
							In stock only
						</label>
					</fieldset>

					<div className="flex gap-3 lg:hidden">
						<button
							type="button"
							onClick={ clearAll }
							className="min-h-12 flex-1 rounded-md text-sm font-bold uppercase tracking-widest text-cream ring-1 ring-peach/40"
						>
							Clear
						</button>
						<button
							type="button"
							onClick={ onClose }
							className="min-h-12 flex-1 rounded-md bg-rust text-sm font-bold uppercase tracking-widest text-cream"
						>
							Show { resultCount }
						</button>
					</div>
				</div>
			</aside>
		</>
	);
};

FilterSidebar.propTypes = {
	facets: PropTypes.object.isRequired,
	filters: PropTypes.object.isRequired,
	toggle: PropTypes.func.isRequired,
	update: PropTypes.func.isRequired,
	clearAll: PropTypes.func.isRequired,
	groupLegend: PropTypes.string,
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	resultCount: PropTypes.number,
	uid: PropTypes.string,
};

export default FilterSidebar;
