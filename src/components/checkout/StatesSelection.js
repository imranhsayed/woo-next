import Error from './Error';
import {isEmpty, map} from "lodash";
import React from "react";

const StateSelection = ({handleOnChange, input, states, isFetchingStates =false }) => {

    const {state, errors } = input || {};

    return (
        <div className="form-group mb-3">
            <label className="text-xs" htmlFor="state">
                State/County
                <abbr className="required" title="required">*</abbr>
            </label>
            <select
                onChange={handleOnChange}
                value={state}
                name="state"
                className="wd-checkout-input"
                id="state"
            >
                {!isFetchingStates ? (
                    <>
                        <option value="">Select a state...</option>
                        {!isEmpty(states) &&
                        map(states, (stateName, stateCode) => (
                            <option key={stateCode} data-countrycode={stateCode} value={stateName}>
                                {stateName}
                            </option>
                        ))}
                    </>
                ) : (
                    <option value="">Loading states...</option>
                )}

            </select>
            <Error errors={errors} fieldName={'state'} />
        </div>
    )
}

export default StateSelection
