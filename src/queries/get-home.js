import { gql } from "@apollo/client";

import PRODUCT_CARD_FIELDS from "./product-card-fields";

/**
 * Everything the home page renders from WooCommerce.
 *
 * One request covers both editorial product slots — the featured trio and the
 * trending row — plus the catalog total for the style ticker. The ticker's
 * per-term counts come from `GET_TICKER_COUNTS`, which needs one aliased
 * search apiece.
 */
const GET_HOME = gql`
query GET_HOME($featuredSlugs: [String], $trendingSlugs: [String]) {
  featured: products(first: 10, where: { slugIn: $featuredSlugs }) {
    nodes {
      ${ PRODUCT_CARD_FIELDS }
    }
  }
  trending: products(first: 10, where: { slugIn: $trendingSlugs }) {
    nodes {
      ${ PRODUCT_CARD_FIELDS }
    }
  }
  catalog: products(first: 1) {
    found
  }
}
`;

/**
 * Match counts for the style ticker's search terms.
 *
 * Each term needs its own aliased connection, so the document is built from
 * the ticker configuration rather than written out by hand.
 *
 * @param {Array} terms Search terms.
 *
 * @return {Object} GraphQL document.
 */
export const buildTickerCountsQuery = ( terms ) => gql`
query GET_TICKER_COUNTS {
  ${ terms.map( ( term, index ) => `
    term_${ index }: products(first: 1, where: { search: "${ term.replace( /"/g, '' ) }" }) {
      found
    }
  ` ).join( '\n' ) }
}
`;

export default GET_HOME;
