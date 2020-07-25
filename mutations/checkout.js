import { gql } from "@apollo/client";

const CHECKOUT_MUTATION = gql`
mutation CHECKOUT_MUTATION( $input: CheckoutInput! ) {
  checkout(input: $input) {
    clientMutationId
    order {
      id
      orderId
      refunds {
        nodes {
          amount
        }
      }
      status
    }
    result
    redirect
  }
}
`;

export default CHECKOUT_MUTATION;
