import Layout from "../components/Layout";
import Product from "../components/Product";
import client from '../components/ApolloClient';
import gql from 'graphql-tag';
import ParentCategoriesBlock from "../components/category/category-block/ParentCategoriesBlock";

/**
 * GraphQL products query.
 */
const PRODUCTS_AND_CATEGORIES_QUERY = gql`query {

				  productCategories {
				    edges {
				      node {
				        id
				        name
				        image {
				          id
				          sourceUrl
				          date
				        }
				      }
				    }
				  }

					products(first: 20) {
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
							price
						}
					}
					
				}`;

const Index = ( props ) => {

	const { products, productCategories } = props;
	console.warn( 'prod', products );
	console.warn( 'ate' , productCategories );

	return (
		<Layout>
			<ParentCategoriesBlock productCategories={ productCategories }/>
			<div className="product-container row">
				{ products.length ? (
					products.map( product => <Product key={ product.id } product={ product } /> )
				) : ''}
			</div>
		</Layout>
	)
};

Index.getInitialProps = async () => {

	const result = await client.query({
		query: PRODUCTS_AND_CATEGORIES_QUERY,
	});

	console.warn( 'resut', result );
	return {
		productCategories: result.data.productCategories.edges,
		products: result.data.products.nodes,
	}

};

export default Index;
