import Layout from "../components/Layout";
import Product from "../components/Product";
import client from '../components/ApolloClient';
import ParentCategoriesBlock from "../components/category/category-block/ParentCategoriesBlock";
import PRODUCTS_AND_CATEGORIES_QUERY from "../queries/product-and-categories";

export default function Home (props) {

	const { products, productCategories } = props;

	return (
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
	)
};

export async function getStaticProps () {

	const { data } = await client.query( {
		query: PRODUCTS_AND_CATEGORIES_QUERY,
	} );

	return {
		props: {
			productCategories: data?.productCategories?.nodes ? data.productCategories.nodes : [],
			products: data?.products?.nodes ? data.products.nodes : [],
		},
		revalidate: 1
	}

};
