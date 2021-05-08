import PropTypes from 'prop-types';
import {memo} from 'react';

import Abbr from "./form-elements/Abbr";
import Error from './Error';

const StateSelection = ({handleOnChange, input, states, isFetchingStates, isShipping }) => {

    // console.log( 'states changed', isShipping, states );

    console.log( 'states', isShipping, states );

    const {state, errors } = input || {};

    const inputId = `state-${isShipping ? 'shipping' : 'billing'}`;

    return (
        <div className="form-group mb-3">
            <label className="leading-7 text-sm text-gray-600" htmlFor={inputId}>
                State/County
                <Abbr required/>
            </label>
            <div className="relative w-full border-none">
                <select
                    onChange={handleOnChange}
                    value={state}
                    name="state"
                    className="bg-gray-100 bg-opacity-50 border border-gray-400 text-gray-500 appearance-none inline-block py-3 pl-3 pr-8 rounded leading-tight w-full"
                    id={inputId}
                >
                    {!isFetchingStates ? (
                        <>
                            <option value="">Select a state...</option>
                            {states.map((state, index) => (
                                <option key={state?.stateCode ?? index} value={state?.stateName ?? ''}>
                                    {state?.stateName}
                                </option>
                            ))}
                        </>
                    ) : (
                        <option value="">Loading states...</option>
                    )}

                </select>
            </div>
            <Error errors={errors} fieldName={'state'} />
        </div>
    )
}

StateSelection.propTypes = {
    handleOnChange: PropTypes.func,
    input: PropTypes.object,
    states: PropTypes.array,
    isFetchingStates: PropTypes.bool,
    isShipping: PropTypes.bool
}

StateSelection.defaultProps = {
    handleOnChange: () => null,
    input: {},
    states: [],
    isFetchingStates: false,
    isShipping: true
}

export default memo(StateSelection);
