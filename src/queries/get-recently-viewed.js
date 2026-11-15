import { gql } from "@apollo/client";

import PRODUCT_CARD_FIELDS from "./product-card-fields";

/**
 * Products for the recently-viewed strip.
 *
 * The slug list lives in the browser, so this one runs on the client.
 */
export const GET_RECENTLY_VIEWED = gql`
query GET_RECENTLY_VIEWED($slugs: [String]) {
  products(first: 10, where: { slugIn: $slugs }) {
    nodes {
      ${ PRODUCT_CARD_FIELDS }
    }
  }
}
`;

export default GET_RECENTLY_VIEWED;
