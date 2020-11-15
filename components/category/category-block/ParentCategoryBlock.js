import Link from 'next/link';;

const ParentCategoryBlock = ( props ) => {

	const { category } = props;

	return (
		<div className="product-column col-lg-3 col-md-6 col-sm-12" >
			<Link href={`/category/${category.slug}`}>
				<a>
					<img
						src={ null !== category.image ? category.image.sourceUrl : '' }
						alt="ParentCategoryBlock image"/>
					<div className="product-title-container">
						<div className="product-title-container-inner">
							<h3 className="product-title">{category.name}</h3>
							<div className="product-shop-now-container">
								<span className="shop-now">Shop Now</span>
							</div>
						</div>
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
