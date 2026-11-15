import { gql } from "@apollo/client";

import PRODUCT_CARD_FIELDS from "./product-card-fields";

/**
 * Products by database ID.
 *
 * The wishlist stores ids in the browser, so this one runs on the client once
 * they have hydrated.
 */
const GET_PRODUCTS_BY_IDS = gql`
query GET_PRODUCTS_BY_IDS($ids: [Int]) {
  products(first: 100, where: { include: $ids }) {
    nodes {
      ${ PRODUCT_CARD_FIELDS }
    }
  }
}
`;

export default GET_PRODUCTS_BY_IDS;
