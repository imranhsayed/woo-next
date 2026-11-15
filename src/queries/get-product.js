import { gql } from "@apollo/client";

import PRODUCT_CARD_FIELDS from "./product-card-fields";

/**
 * One product, with everything its page renders.
 *
 * Variations carry their own price and stock status, which is what drives the
 * buy box's size/colour matrix. Reviews come through the comment connection,
 * where the rating sits on the edge rather than the node.
 */
const GET_PRODUCT = gql`
query GET_PRODUCT($slug: ID!) {
  product(id: $slug, idType: SLUG) {
    date
    sku
    description
    shortDescription
    # Aliased: PRODUCT_CARD_FIELDS already selects galleryImages(first: 1)
    # for the card's hover image, and GraphQL rejects the same field twice
    # with different arguments.
    gallery: galleryImages(first: 12) {
      nodes {
        id
        sourceUrl
        altText
      }
    }
    reviews(first: 50) {
      averageRating
      edges {
        rating
        node {
          id
          content
          date
          author {
            node {
              name
            }
          }
        }
      }
    }
    ... on VariableProduct {
      variations(first: 200) {
        nodes {
          databaseId
          price
          regularPrice
          onSale
          stockStatus
          stockQuantity
          attributes {
            nodes {
              name
              value
            }
          }
        }
      }
    }
    ${ PRODUCT_CARD_FIELDS }
  }
}
`;

/**
 * Products to recommend alongside one product.
 *
 * Same category, most popular first — the server orders it, since
 * `total_sales` is not readable over public GraphQL.
 */
export const GET_RELATED_PRODUCTS = gql`
query GET_RELATED_PRODUCTS($category: String!, $first: Int = 5) {
  products(first: $first, where: { category: $category, orderby: { field: POPULARITY, order: DESC } }) {
    nodes {
      ${ PRODUCT_CARD_FIELDS }
    }
  }
}
`;

/** Product slugs, for `getStaticPaths`. */
export const GET_PRODUCT_SLUGS = gql`
query GET_PRODUCT_SLUGS {
  products(first: 200) {
    nodes {
      id
      slug
    }
  }
}
`;

export default GET_PRODUCT;
