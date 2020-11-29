import ProductCategoryBlock from "./ParentCategoryBlock";

const ParentCategoriesBlock = ( props ) => {

	const { productCategories } = props;

	return (

		<div className="product-categories grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
			{ productCategories.length ? (
				productCategories.map( productCategory => <ProductCategoryBlock key={ productCategory.id }  category={ productCategory }/> )
			) : '' }
		</div>

	)

};

export default ParentCategoriesBlock;
