import gql from "graphql-tag";

const CLEAR_CART_MUTATION = gql`
mutation CLEAR_CART_MUTATION( $input: RemoveItemsFromCartInput! ) {
  removeItemsFromCart(input: $input) {
    cartItems {
      quantity
    }
  }
}
`;

export default CLEAR_CART_MUTATION;
