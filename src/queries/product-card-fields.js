/**
 * Everything a product card renders.
 *
 * Shared by the home page, the catalog and quick view so one shape feeds the
 * card component everywhere. Two images drive the hover swap; the category
 * list supplies both the subcategory label and New / Offers membership;
 * `stockQuantity` with `lowStockAmount` drives the "Only N left" badge.
 */
const PRODUCT_CARD_FIELDS = `
  id
  databaseId
  name
  slug
  type
  onSale
  averageRating
  reviewCount
  image {
    id
    sourceUrl
    altText
  }
  galleryImages(first: 1) {
    nodes {
      id
      sourceUrl
    }
  }
  productCategories(first: 10) {
    nodes {
      name
      slug
      parentDatabaseId
    }
  }
  ... on SimpleProduct {
    price
    regularPrice
    stockStatus
    stockQuantity
    lowStockAmount
    virtual
    downloadable
    attributes {
      nodes {
        name
        options
      }
    }
  }
  ... on VariableProduct {
    price
    regularPrice
    stockStatus
    stockQuantity
    lowStockAmount
    attributes {
      nodes {
        name
        options
      }
    }
  }
  ... on ExternalProduct {
    price
    regularPrice
    externalUrl
  }
`;

export default PRODUCT_CARD_FIELDS;
