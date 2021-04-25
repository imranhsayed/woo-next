import { gql } from "@apollo/client";

/**
 * GraphQL countries query.
 */
const GET_STATES = gql`query GET_STATES($countryCode: String!) {
  wooStates(countryCode: $countryCode) {
    states
  }
}`;

export default GET_STATES;
