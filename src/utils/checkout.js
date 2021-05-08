import client from "../components/ApolloClient";
import GET_STATES from "../queries/get-states";

/**
 * Get states
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
 * @param target
 * @param setTheStates
 *
 * @return {Promise<void>}
 */
export const setStatesForCountry = async ( target, setTheStates ) => {
    if ( 'country' === target.name ) {
        const countryCode = target[target.selectedIndex].getAttribute('data-countrycode')
        const states = await getStates( countryCode );
        setTheStates( states || [] );
    }
}
