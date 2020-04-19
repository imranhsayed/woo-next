import Layout from "../components/Layout";
import { withRouter } from 'next/router';
import client from "../components/ApolloClient";
import gql from 'graphql-tag';
import Product from "../components/Product";

const PRODUCT_BY_CATEGORY_ID = gql` query Product_Category( $id: ID ! ) {
			productCategory( id: $id ) {
			          name
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

			}
	 }`;

const Category = withRouter( props => {

	const { categoryName, products } = props;

	return (
		<Layout>
			{ categoryName ? <h3 className="product-container pl-5">{ categoryName }</h3> : '' }
			<div className="product-container row">
				{ undefined !== products && products.length ? (
					products.map( product => <Product key={ product.id } product={ product } /> )
				) : ''}
			</div>
		</Layout>
	)
});

Category.getInitialProps = async function( context ) {

	let { query: { slug } } = context;

	const id = slug ? slug.split( '-' ).pop() : context.query.id;

	const res = await client.query(({
		query: PRODUCT_BY_CATEGORY_ID,
		variables: { id }
	}));

	return {
		categoryName: res.data.productCategory.name,
		products: res.data.productCategory.products.nodes
	}

};

export default Category;
