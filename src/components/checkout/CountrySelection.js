import Error from './Error';
import {isEmpty, map} from "lodash";

const CountrySelection = ({input, handleOnChange, countries}) => {

    const {country, errors} = input || {};

    return (
        <div className="form-group mb-3">
            <label className="text-xs" htmlFor="country-select">
                Country
                <abbr className="required" title="required">*</abbr>
            </label>
            <select
                onChange={handleOnChange}
                value={country}
                name="country"
                className="form-control woo-next-checkout-input p-1 w-full border-solid border border-gray-500 rounded"
                id="country-select">
                <option value="">Select a country...</option>
                    {!isEmpty(countries) &&
                    map(countries, (countryName, countryCode) => (
                        <option key={countryCode} data-countrycode={countryCode} value={countryName}>
                            {countryName}
                        </option>
                    ))}
            </select>
            <Error errors={errors} fieldName={'country'}/>
        </div>
    );
}

export default CountrySelection;
