import Layout from "../components/Layout";
import client from '../components/ApolloClient';
import ParentCategoriesBlock from "../components/category/category-block/ParentCategoriesBlock";
import GET_CATEGORIES_QUERY from "../queries/get-categories";

export default function Categories ( props ) {

	const { productCategories } = props;

	return (
		<Layout>
			{/*Categories*/}
			<div className="mt-5 text-center content-wrap">
				<h2>Categories</h2>
				<ParentCategoriesBlock productCategories={ productCategories }/>
			</div>
		</Layout>
	)
};

export async function getStaticProps() {

	const {data} = await client.query({
		query: GET_CATEGORIES_QUERY,
	});

	return {
		props: {
			productCategories: data?.productCategories?.nodes || []
		},
		revalidate: 1
	}

};
