import gql from "graphql-tag";

/**
 * GraphQL categories and products query.
 */
const PRODUCTS_AND_CATEGORIES_QUERY = gql`query {

	productCategories(first: 3) {
		nodes {
			id
			name
			slug
			image {
				sourceUrl
				srcSet
			}
		}
	}

	  products(first: 50) {
	    nodes {
	      id
	      productId
	      averageRating
	      slug
	      description
	      image {
	        uri
	        title
	        srcSet
	        sourceUrl
	      }
	      name
	      ... on SimpleProduct {
	        price
	        id
	      }
	      ... on VariableProduct {
	        price
	        id
	      }
	      ... on ExternalProduct {
	        price
	        id
	        externalUrl
	      }
	      ... on GroupProduct {
	        products {
	          nodes {
	            ... on SimpleProduct {
	              price
	            }
	          }
	        }
	        id
	      }
	    }
	  }
						
}`;

export default PRODUCTS_AND_CATEGORIES_QUERY;
