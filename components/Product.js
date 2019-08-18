const Product = ( props ) => {

	const { product } = props;
	return (
		<div className="card mb-3 mr-4" >
			<h3 className="card-header text-center">{product.name}</h3>
			<img
			     src={ product.image.sourceUrl }
			     alt="Product image"/>
			<div className="card-body text-center">
				<h6 className="card-subtitle mb-3">{ product.price }</h6>
				<a href="" className="btn btn-secondary">View</a>
			</div>

		</div>
	);
}

export default Product;
