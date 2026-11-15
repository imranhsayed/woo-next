import { gql } from "@apollo/client";

import PRODUCT_CARD_FIELDS from "./product-card-fields";

/**
 * Catalog fields: everything a card needs, plus `date` so the client can
 * offer a "Newest" sort without another request.
 */
const CATALOG_FIELDS = `
  date
  ${ PRODUCT_CARD_FIELDS }
`;

/**
 * Every product in one category, with that category's own copy and children.
 *
 * The filter sidebar derives its facets and counts from this list, so the page
 * fetches the category in full rather than one page at a time.
 */
export const GET_CATEGORY_CATALOG = gql`
query GET_CATEGORY_CATALOG($slug: ID!, $first: Int = 100) {
  productCategory(id: $slug, idType: SLUG) {
    id
    databaseId
    name
    slug
    description
    count
    parentDatabaseId
    parent {
      node {
        name
        slug
      }
    }
    children(first: 50) {
      nodes {
        id
        databaseId
        name
        slug
        count
      }
    }
    products(first: $first) {
      nodes {
        ${ CATALOG_FIELDS }
      }
    }
  }
}
`;

/** The full catalog, for /shop. */
export const GET_SHOP_CATALOG = gql`
query GET_SHOP_CATALOG($first: Int = 100) {
  products(first: $first) {
    found
    nodes {
      ${ CATALOG_FIELDS }
    }
  }
}
`;

/** Search results, for /search/[query]. */
export const GET_SEARCH_CATALOG = gql`
query GET_SEARCH_CATALOG($search: String!, $first: Int = 100) {
  products(first: $first, where: { search: $search }) {
    found
    nodes {
      ${ CATALOG_FIELDS }
    }
  }
}
`;

/**
 * Slugs in popularity order.
 *
 * WooCommerce keeps `total_sales` private, so it comes back null over public
 * GraphQL and cannot be sorted on in the browser. Asking the server to order
 * by popularity and keeping the resulting positions gives the client the rank
 * it needs for the "Most popular" sort.
 */
export const GET_POPULARITY_ORDER = gql`
query GET_POPULARITY_ORDER($first: Int = 100) {
  products(first: $first, where: { orderby: { field: POPULARITY, order: DESC } }) {
    nodes {
      slug
    }
  }
}
`;

/** Category slugs, for `getStaticPaths`. */
export const GET_CATEGORY_SLUGS = gql`
query GET_CATEGORY_SLUGS {
  productCategories(first: 100, where: { hideEmpty: false }) {
    nodes {
      id
      slug
    }
  }
}
`;
