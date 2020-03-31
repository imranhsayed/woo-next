import Layout from "../components/Layout";
import Product from "../components/Product";
import client from '../components/ApolloClient';
import gql from 'graphql-tag';
import ParentCategoriesBlock from "../components/category/category-block/ParentCategoriesBlock";
import { ApolloProvider, Mutation } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';

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

const Index = ( props ) => {

	const { products, productCategories } = props;

	return (
		<ApolloProvider client={ client }>
			<ApolloHooksProvider client={ client }>
				<Layout>
					{/*Categories*/ }
					<div className="mt-5 text-center">
						<h2>Categories</h2>
						<ParentCategoriesBlock productCategories={ productCategories }/>
					</div>
					{/*Products*/ }

					<h2 className="mt-5 text-center">Products</h2>
					<div className="product-container row">
						{ products.length ? (
							products.map( product => <Product key={ product.id } product={ product }/> )
						) : '' }
					</div>
				</Layout>
			</ApolloHooksProvider>
		</ApolloProvider>
	)
};

Index.getInitialProps = async () => {

	const result = await client.query( {
		query: PRODUCTS_AND_CATEGORIES_QUERY,
	} );

	return {
		productCategories: result.data.productCategories.nodes,
		products: result.data.products.nodes,
	}

};

export default Index;
