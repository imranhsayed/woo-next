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
        		id
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
	        id
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
          	id
	        products {
	          nodes {
	            ... on SimpleProduct {
				  id
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
