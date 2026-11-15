import { gql } from "@apollo/client";

/**
 * Product fields the search overlay and its trending column need.
 */
const SEARCH_RESULT_FIELDS = `
  id
  databaseId
  name
  slug
  image {
    id
    sourceUrl
    altText
  }
  productCategories(first: 5) {
    nodes {
      name
      slug
      parentDatabaseId
    }
  }
  ... on SimpleProduct {
    price
  }
  ... on VariableProduct {
    price
  }
  ... on ExternalProduct {
    price
  }
`;

/**
 * Search the catalog.
 *
 * `found` is the full match count, so the overlay can offer "View all N
 * results" while only rendering the first handful.
 */
export const SEARCH_PRODUCTS = gql`
query SEARCH_PRODUCTS($search: String!, $first: Int = 6) {
  products(first: $first, where: { search: $search, status: "publish" }) {
    found
    nodes {
      ${ SEARCH_RESULT_FIELDS }
    }
  }
}
`;

/**
 * Best-selling products, for the overlay's "Trending now" column.
 *
 * Popularity reads WooCommerce's `total_sales`, which the catalog seed set
 * from the prototype's popularity score.
 */
export const GET_TRENDING_PRODUCTS = gql`
query GET_TRENDING_PRODUCTS($first: Int = 4) {
  products(first: $first, where: { orderby: { field: POPULARITY, order: DESC }, status: "publish" }) {
    nodes {
      ${ SEARCH_RESULT_FIELDS }
    }
  }
}
`;

export default SEARCH_PRODUCTS;
