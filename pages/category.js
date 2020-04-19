import Layout from "../components/Layout";
import { withRouter } from 'next/router';
import client from "../components/ApolloClient";
import Product from "../components/Product";
import PRODUCT_BY_CATEGORY_ID from "../queries/product-by-category";

const Category = withRouter( props => {

	const { categoryName, products } = props;

	return (
		<Layout>
			<div className="content-wrap">
				{ categoryName ? <h3 className="product-container pl-5">{ categoryName }</h3> : '' }
				<div className="product-container row">
					{ undefined !== products && products.length ? (
						products.map( product => <Product key={ product.id } product={ product } /> )
					) : ''}
				</div>
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
