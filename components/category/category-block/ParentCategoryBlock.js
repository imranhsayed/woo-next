import Link from 'next/link';;

const ParentCategoryBlock = ( props ) => {

	const { category } = props;

	return (
		<div className="col-lg-3 col-md-6 col-sm-12" >
			<h3 className="card-header text-center">{category.name}</h3>

			<Link as={`/category/${category.slug}-${category.id}`} href={`/category?slug=${category.slug}-${category.id}`}>
				<a>
					<img
						src={ null !== category.image ? category.image.sourceUrl : '' }
						alt="ParentCategoryBlock image"/>
				</a>
			</Link>
			{/*<div className="card-body text-center">*/}
			{/*	<h6 className="card-subtitle mb-3">Hello</h6>*/}
			{/*</div>*/}

		</div>
	);
}

export default ParentCategoryBlock;
