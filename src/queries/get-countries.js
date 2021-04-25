import { gql } from "@apollo/client";

/**
 * GraphQL countries query.
 */
const GET_COUNTRIES = gql`query {
  wooCountries {
    billingCountries
    shippingCountries
  }
}`;

export default GET_COUNTRIES;
