import { gql } from "@apollo/client";

/**
 * GraphQL countries query.
 */
const GET_STATES = gql`query GET_STATES($countryCode: String!) {
  wooStates(countryCode: $countryCode) {
    states {
      stateCode
      stateName
    }
  }
}`;

export default GET_STATES;
