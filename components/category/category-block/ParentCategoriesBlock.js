import client from "../../ApolloClient";
import Layout from "../../Layout";
import Product from "../../Product";
import gql from 'graphql-tag';

const ParentCategoriesBlock = ( props ) => {

	const { productCategories } = props;
	console.warn( 'e', productCategories );

	return (
		<div></div>


	)

};

export default ParentCategoriesBlock;
