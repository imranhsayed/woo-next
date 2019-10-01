import Layout from "../components/Layout";
import client from '../components/ApolloClient';
import gql from 'graphql-tag';
import ParentCategoriesBlock from "../components/category/category-block/ParentCategoriesBlock";

/**
 * GraphQL categories query.
 */
const CATEGORIES_QUERY = gql`query {

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
					
				}`;

const Categories = ( props ) => {

	const { productCategories } = props;

	return (
		<Layout>
			{/*Categories*/}
			<div className="mt-5 text-center">
				<h2>Categories</h2>
				<ParentCategoriesBlock productCategories={ productCategories }/>
			</div>
		</Layout>
	)
};

Categories.getInitialProps = async () => {

	const result = await client.query({
		query: CATEGORIES_QUERY,
	});

	return {
		productCategories: result.data.productCategories.nodes,
	}

};

export default Categories;
