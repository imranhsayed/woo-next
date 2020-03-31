import { useQuery, useMutation } from "@apollo/react-hooks";
import Layout from "../components/Layout";
import { withRouter } from 'next/router';
import client from "../components/ApolloClient";
import gql from 'graphql-tag';
import AddToCartButton from "../components/cart/AddToCartButton";
import { ApolloProvider, Mutation } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';
import AddToCartButton from "../components/product/AddToCartButton";
import clientConfig from "../client-config";

const Product = withRouter( props => {

	const { product } = props;
	console.warn( 'product', product );

	return (
		<ApolloProvider client={ client }>
			<ApolloHooksProvider client={client}>
				<Layout>
					{ product ? (
						<div className="woo-next-single">
							<div className="woo-next-single__product card bg-light mb-3 p-5">
								<div className="card-header">{ product.name }</div>
								<div className="card-body">
									<h4 className="card-title">{ product.name }</h4>
									<img src={ product.image.sourceUrl } alt="Product Image" width="200" srcSet={ product.image.srcSet }/>
									<p
										dangerouslySetInnerHTML={ {
											__html: product.description,
										} }
										className="card-text"/>
									<AddToCartButton product={ product } productQryInput={{
										clientMutationId: clientConfig.addToCartClientMutationID,
										productId: product.productId,
									}}/>
								</div>
							</div>
						</div>
					) : '' }
				</Layout>
			</ApolloHooksProvider>
		</ApolloProvider>

	)
});

Product.getInitialProps = async function( context ) {

	let { query: { slug } } = context;
	const id = slug ? parseInt( slug.split( '-' ).pop() ) : context.query.id;

	const PRODUCT_QUERY = gql` query Product( $id: ID! ) {
			product ( id: $id, idType: DATABASE_ID ) {
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


	 }`;

	const res = await client.query(({
		query: PRODUCT_QUERY,
		variables: { id }
	}));

	console.warn( 'res', res );

	return {
		product: res.data.product
	}

};


export default Product;
