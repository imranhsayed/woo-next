import PropTypes from 'prop-types';
import cx from 'classnames';

import Icon from '../ui/Icon';

/**
 * One checkout form field.
 *
 * Renders an input or a select from the same definition, carrying the label,
 * required marker and inline error. The error is wired through
 * `aria-describedby` so it is announced with the field.
 *
 * @param {Object} props Component props.
 *
 * @return {jsx}
 */
const CheckoutField = ( { field, group, value, error = '', options = [], placeholder = 'Select…', disabled = false, onChange } ) => {

	const id = `${ group }-${ field.name }`;
	const errorId = `${ id }-error`;

	const ring = error ? 'ring-flame' : 'ring-peach/30';

	return (
		<div className={ cx( 'flex flex-col gap-1.5', field.span ) }>
			<label htmlFor={ id } className="text-xs font-bold uppercase tracking-widest text-cream">
				{ field.label }
				{ field.required ? <span className="text-flame" aria-hidden="true"> *</span> : null }
			</label>

			{ 'select' === field.type ? (
				<select
					id={ id }
					name={ field.name }
					autoComplete={ field.autoComplete }
					value={ value }
					onChange={ ( event ) => onChange( field.name, event.target.value ) }
					disabled={ disabled || ! options.length }
					aria-required={ field.required ? 'true' : 'false' }
					aria-invalid={ error ? 'true' : 'false' }
					aria-describedby={ error ? errorId : undefined }
					className={ cx(
						'min-h-12 rounded-md border-0 bg-petrol px-4 text-cream ring-1 focus:ring-2 focus:ring-flame disabled:opacity-60',
						ring
					) }
				>
					{ /* A placeholder keeps an unset value visible: a select whose
					     value matches no option renders blank and silently submits
					     nothing. */ }
					<option value="">{ options.length ? placeholder : '—' }</option>
					{ options.map( ( option ) => (
						<option key={ option.code } value={ option.code }>{ option.name }</option>
					) ) }
				</select>
			) : (
				<input
					id={ id }
					name={ field.name }
					type={ field.type }
					autoComplete={ field.autoComplete }
					value={ value }
					onChange={ ( event ) => onChange( field.name, event.target.value ) }
					disabled={ disabled }
					aria-required={ field.required ? 'true' : 'false' }
					aria-invalid={ error ? 'true' : 'false' }
					aria-describedby={ error ? errorId : undefined }
					className={ cx(
						'min-h-12 rounded-md border-0 bg-petrol px-4 text-cream ring-1 placeholder-peach/40 focus:ring-2 focus:ring-flame',
						ring
					) }
				/>
			) }

			{ error ? (
				<p id={ errorId } className="flex items-center gap-1.5 text-sm font-semibold text-flame">
					<Icon name="alert" className="h-4 w-4" />{ error }
				</p>
			) : null }
		</div>
	);
};

CheckoutField.propTypes = {
	field: PropTypes.object.isRequired,
	group: PropTypes.string.isRequired,
	value: PropTypes.string,
	error: PropTypes.string,
	options: PropTypes.array,
	placeholder: PropTypes.string,
	disabled: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
};

export default CheckoutField;
