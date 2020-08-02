import gql from "graphql-tag";

const PRODUCT_BY_CATEGORY_ID = gql` query Product_Category($id: ID!) {
	productCategory(id: $id) {
	  id
	  name
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
	}
  }
  `;

export default PRODUCT_BY_CATEGORY_ID;
