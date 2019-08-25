import Link from 'next/link';
import AddToCartButton from "./cart/AddToCartButton";
const Product = ( props ) => {

	const { product } = props;
	
	console.warn( 'product', product );
	
	return (
		<div className="card mb-3 mr-4" >
			<h3 className="card-header text-center">{product.name}</h3>

			<Link as={`/product/${product.slug}-${product.productId}`} href={`/product?slug=${product.slug}-${product.productId}`}>
				<a>
					<img
						src={ product.image.sourceUrl }
						alt="Product image"/>
				</a>
			</Link>
			<div className="card-body text-center">
				<h6 className="card-subtitle mb-3">{ product.price }</h6>
				<AddToCartButton product={ product } />
			</div>

		</div>
	);
}

export default Product;
