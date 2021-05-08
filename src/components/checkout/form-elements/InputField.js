import Error from "../Error";
import PropTypes from 'prop-types';

const InputField = ({ handleOnChange, inputValue, name, type, label, errors, placeholder, required, containerClassNames }) => {
    return (
        <div className={containerClassNames}>
            <label className="leading-7 text-sm text-gray-600" htmlFor={name}>
                { label || '' }
                { required ? <abbr className="text-red-500" style={{textDecoration: 'none'}} title="required">*</abbr> : null }
            </label>
            <input
                onChange={ handleOnChange }
                value={ inputValue }
                placeholder={placeholder}
                type={type}
                name={name}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-400 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                id={name}
            />
            <Error errors={ errors } fieldName={ name }/>
        </div>
    )
}

InputField.propTypes = {
    handleOnChange: PropTypes.func,
    inputValue: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    errors: PropTypes.object,
    required: PropTypes.bool,
    containerClassNames: PropTypes.string
}

InputField.defaultProps = {
    handleOnChange: () => null,
    inputValue: '',
    name: '',
    type: 'text',
    label: '',
    placeholder: '',
    errors: {},
    required: false,
    containerClassNames: ''
}

export default InputField;
