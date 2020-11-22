import Layout from "../components/Layout";
import Product from "../components/Product";
import client from '../components/ApolloClient';
import ParentCategoriesBlock from "../components/category/category-block/ParentCategoriesBlock";
import PRODUCTS_AND_CATEGORIES_QUERY from "../queries/product-and-categories";

export default function Home (props) {

	const { products, productCategories } = props;

	return (
			<Layout>
				<div className="banner flex justify-between">
					<div className="banner-img">
						<img src="https://user-images.githubusercontent.com/12367607/99764486-30f2cb80-2b23-11eb-994d-e0a689939147.png"/>
						<div className="slider-button">
							<a href="/">
								<svg width="25px" className="inline-block mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
							</a>
							<a href="/">
								<svg width="25px" className="inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
							</a>
						</div>
					</div>
					<div className="banner-content px-10">
						<h2 className="banner-content__title text-base md:text-4xl uppercase">Winter Wear Collection</h2>
						<p className="banner-content__description text-base md:text-2xl text-gray-700">Up To 50% Off</p>
						<a href="/" className="banner-content__link text-gray-700">+ Explore</a>
					</div>
				</div>

				{/*Categories*/ }
				<div className="product-categories-container container mx-auto my-32 px-4 xl:px-0">
					<h2 className="text-2xl mb-5 uppercase">Categories</h2>
					<ParentCategoriesBlock productCategories={ productCategories }/>
				</div>
				{/*Products*/ }

				<div className="products container mx-auto my-32 px-4 xl:px-0">
					<h2 className="products-main-title mb-5 text-2xl uppercase">Products</h2>
					<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
						{ products.length ? (
							products.map( product => <Product key={ product.id } product={ product }/> )
						) : '' }
					</div>
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
