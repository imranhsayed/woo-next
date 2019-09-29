import client from "../../ApolloClient";
import Layout from "../../Layout";
import ProductCategoryBlock from "./ParentCategoryBlock";
import gql from 'graphql-tag';

const ParentCategoriesBlock = ( props ) => {

	const { productCategories } = props;

	return (

		<div className="product-container row">
			{ productCategories.length ? (
				productCategories.map( productCategories => <ProductCategoryBlock key={ productCategories.node.id }  category={ productCategories.node }/> )
			) : '' }
		</div>

	)

};

export default ParentCategoriesBlock;
