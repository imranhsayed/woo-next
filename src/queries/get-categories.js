import { gql } from "@apollo/client";

/**
 * GraphQL categories query.
 */
const GET_CATEGORIES_QUERY = gql`query {

	productCategories(first: 3) {
		nodes {
			id
			name
			slug
			image {
				sourceUrl
				altText
			}
		}
	}
	
}`;

export default GET_CATEGORIES_QUERY;
