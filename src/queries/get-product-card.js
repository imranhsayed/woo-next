import { gql } from "@apollo/client";

import PRODUCT_CARD_FIELDS from "./product-card-fields";

/**
 * One product by slug, with the card fields plus its short description.
 *
 * Used by quick view, which opens with only the slug the card handed it.
 */
const GET_PRODUCT_CARD = gql`
query GET_PRODUCT_CARD($slug: ID!) {
  product(id: $slug, idType: SLUG) {
    shortDescription
    ${ PRODUCT_CARD_FIELDS }
  }
}
`;

export default GET_PRODUCT_CARD;
