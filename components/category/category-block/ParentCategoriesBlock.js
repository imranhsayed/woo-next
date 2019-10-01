import ProductCategoryBlock from "./ParentCategoryBlock";

const ParentCategoriesBlock = ( props ) => {

	const { productCategories } = props;

	return (

		<div className="product-container row d-flex justify-content-center">
			{ productCategories.length ? (
				productCategories.map( productCategories => <ProductCategoryBlock key={ productCategories.id }  category={ productCategories }/> )
			) : '' }
		</div>

	)

};

export default ParentCategoriesBlock;
