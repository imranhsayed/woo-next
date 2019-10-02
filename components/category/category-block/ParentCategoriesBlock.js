import ProductCategoryBlock from "./ParentCategoryBlock";

const ParentCategoriesBlock = ( props ) => {

	const { productCategories } = props;

	return (

		<div className="product-container row d-flex justify-content-center">
			{ productCategories.length ? (
				productCategories.map( productCategory => <ProductCategoryBlock key={ productCategory.id }  category={ productCategory }/> )
			) : '' }
		</div>

	)

};

export default ParentCategoriesBlock;
