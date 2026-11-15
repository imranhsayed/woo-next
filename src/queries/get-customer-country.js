import { gql } from "@apollo/client";

/**
 * The session's shipping country.
 *
 * Shipping rates follow the address stored on the WooCommerce session, so the
 * cart's country selector reads its current value from there rather than
 * keeping a separate copy.
 */
const GET_CUSTOMER_COUNTRY = gql`
query GET_CUSTOMER_COUNTRY {
  customer {
    shipping {
      country
    }
  }
}
`;

export default GET_CUSTOMER_COUNTRY;
