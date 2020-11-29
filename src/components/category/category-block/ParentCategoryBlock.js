import Link from 'next/link';

const ParentCategoryBlock = ( props ) => {

	const { category } = props;

	return (
		<div className="product mb-5">
			<Link href={`/category/${category.slug}`}>
				<a>
					<img
						className="object-cover h-40 md:h-64"
						src={ category?.image?.sourceUrl ? category.image.sourceUrl : '' }
						srcSet={ category?.image?.srcSet ? category.image.srcSet : '' }
						alt="ParentCategoryBlock image"/>
					<div className="product-title-container p-3">
						<h3 className="product-title text-lg font-medium">{category.name}</h3>
						<span className="shop-now text-sm">+ Explore</span>
					</div>
				</a>
			</Link>

			{/*<div className="card-body text-center">*/}
			{/*	<h6 className="card-subtitle mb-3">Hello</h6>*/}
			{/*</div>*/}

		</div>
	);
}

export default ParentCategoryBlock;
