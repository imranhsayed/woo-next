import Layout from "../components/Layout";
import { withRouter } from 'next/router';
import client from '../components/ApolloClient';
import gql from 'graphql-tag';

const Product = withRouter(props => {

	const { product } = props;

	return (
		<Layout>
			{product ? (
				<div className="card bg-light mb-3 p-5">
					<div className="card-header">{product.name}</div>
					<div className="card-body">
						<h4 className="card-title">{product.name}</h4>
						<img className="product-image"  width="300" src={product.image.sourceUrl} srcSet={product.image.srcSet} alt={product.name} />
						<p className="card-text">{product.price}</p>
						<p className="card-text" key={product.id}>
							{product.description}
						</p>
					</div>
				</div>
			) : ''}
		</Layout>

	)
});


Product.getInitialProps = async function (context) {
	let { query: { slug } } = context;
	const id = slug ? parseInt(slug.split('-').pop()) : context.query.id;

	const PRODUCT_QUERY = gql`query Product( $id: Int! ) {
		productBy( productId: $id ) {
			name
			price
			slug
			description
			productId
			image {
				uri
				title
				srcSet
				sourceUrl
			}
		}
	}`;

	const res = await client.query({
		query: PRODUCT_QUERY,
		variables: { id }
	});

	return {
		product: res.data.productBy
	}
};

export default Product
