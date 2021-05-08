import client from "../components/ApolloClient";
import GET_STATES from "../queries/get-states";

/**
 * Get states
 *
 * @param {String} countryCode Country code
 *
 * @returns {Promise<void>}
 */
export const getStates = async ( countryCode ) => {
    const { data } = await client.query( {
        query: GET_STATES,
        variables: { countryCode: countryCode || '' }
    } )

    return data?.wooStates?.states ?? [];
}

/**
 * Set states for the country.
 *
 * @param {Object} target Target.
 * @param {Function} setTheStates React useState function to set the value of the states basis country selection.
 * @param {Function} setIsFetchingStates React useState function, to manage loading state when request is in process.
 *
 * @return {Promise<void>}
 */
export const setStatesForCountry = async ( target, setTheStates, setIsFetchingStates ) => {
    if ( 'country' === target.name ) {
        setIsFetchingStates(true);
        const countryCode = target[target.selectedIndex].getAttribute('data-countrycode')
        const states = await getStates( countryCode );
        setTheStates( states || [] );
        setIsFetchingStates(false);
    }
}
