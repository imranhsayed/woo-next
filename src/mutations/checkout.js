import { gql } from "@apollo/client";

/**
 * Place an order through a WooCommerce payment gateway.
 *
 * `databaseId` and `orderKey` are what the confirmation page needs: a guest
 * cannot read their own order over GraphQL, so the key is passed to the
 * server-side lookup instead.
 */
const CHECKOUT_MUTATION = gql`
mutation CHECKOUT_MUTATION( $input: CheckoutInput! ) {
  checkout(input: $input) {
    clientMutationId
    result
    redirect
    order {
      id
      databaseId
      orderKey
      orderNumber
      status
    }
  }
}
`;

export default CHECKOUT_MUTATION;
