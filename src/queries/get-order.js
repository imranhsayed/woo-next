import { gql } from "@apollo/client";

export const GET_ORDER = gql`
query GET_ORDER( $orderId: ID! ) {
  order(id: $orderId, idType: DATABASE_ID) {
    total
    lineItems {
      nodes {
        product {
          id
          productId: databaseId
          name
          type
          onSale
          slug
          image {
            id
            sourceUrl
            altText
          }
        }
      }
    }
  }
}
`;

export const GET_ORDER_TOTAL = gql`
query GET_ORDER_TOTAL( $orderId: ID! ) {
  order(id: $orderId, idType: DATABASE_ID) {
    total(format: RAW)
  }
}
`;
