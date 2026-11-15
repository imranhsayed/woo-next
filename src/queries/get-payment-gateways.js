import { gql } from "@apollo/client";

/**
 * Payment gateways the store has enabled.
 *
 * Checkout filters its options against this, so a gateway switched off in
 * WooCommerce can never be selected on the storefront.
 */
const GET_PAYMENT_GATEWAYS = gql`
query GET_PAYMENT_GATEWAYS {
  paymentGateways {
    nodes {
      id
      title
      description
    }
  }
}
`;

export default GET_PAYMENT_GATEWAYS;
