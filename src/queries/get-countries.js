import { gql } from "@apollo/client";

/**
 * GraphQL countries query.
 */
const GET_COUNTRIES = gql`query {
  wooCountries {
    countries
  }
}`;

export default GET_COUNTRIES;
