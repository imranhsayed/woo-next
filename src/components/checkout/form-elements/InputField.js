import Error from "../Error";
import PropTypes from 'prop-types';
import Abbr from "./Abbr";

const InputField = ({ handleOnChange, inputValue, name, type, label, errors, placeholder, required, containerClassNames, isShipping }) => {

    const inputId = `${name}-${isShipping ? 'shipping' : ''}`;

    return (
        <div className={containerClassNames}>
            <label className="leading-7 text-sm text-gray-700" htmlFor={inputId}>
                { label || '' }
                <Abbr required={required}/>
            </label>
            <input
                onChange={ handleOnChange }
                value={ inputValue }
                placeholder={placeholder}
                type={type}
                name={name}
                className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-500 focus:border-indigo-500 focus:bg-transparent focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                id={inputId}
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
