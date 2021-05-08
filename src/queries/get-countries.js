import { gql } from "@apollo/client";

/**
 * GraphQL countries query.
 */
const GET_COUNTRIES = gql`query GET_COUNTRIES{
  wooCountries {
    billingCountries {
      countryCode
      countryName
    }
    shippingCountries {
      countryCode
      countryName
    }
  }
}`;

export default GET_COUNTRIES;
