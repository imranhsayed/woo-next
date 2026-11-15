import { gql } from "@apollo/client";

/**
 * Top-level product categories with their children.
 *
 * Feeds the header mega menu, the mobile drawer and the search overlay's
 * "popular categories" column. `hideEmpty: false` keeps a category in the nav
 * while it has no published products yet.
 */
const GET_NAV_CATEGORIES = gql`
query GET_NAV_CATEGORIES {
  productCategories(first: 100, where: { parent: 0, hideEmpty: false }) {
    nodes {
      id
      databaseId
      name
      slug
      count
      description
      image {
        id
        sourceUrl
        altText
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
    }
  }
}
`;

export default GET_NAV_CATEGORIES;
