import Link from 'next/link';
import AddToCartButton from '../components/cart/AddToCartButton';
import clientConfig from '../client-config';
import { isEmpty } from '../functions'

const Product = ( props ) => {

	const { product } = props;

	return (
		// @TODO Need to handle Group products differently.
		undefined !== product && 'GroupProduct' !== product.__typename ? (
			<div className="col-lg-3 col-md-6 col-sm-12">
				<h3 className="text-center card-header">
					{ product.name ? product.name : '' }
				</h3>

				<Link
					as={ `/product/${ product.slug }-${ product.productId }` }
					href={ `/product?slug=${ product.slug }-${ product.productId }` }
				>
					<a>
						{ !isEmpty( product.image ) ? (
							<img src={ product.image.sourceUrl } alt="Product image"/>
						) : !isEmpty( clientConfig.productImagePlaceholder ) ? (
							<img
								src={ clientConfig.productImagePlaceholder }
								alt="Placeholder product image"
							/>
						) : null }
					</a>
				</Link>
				<div className="text-center card-body">
					<h6 className="mb-3 card-subtitle">{ product.price }</h6>
					<AddToCartButton product={ product }/>
				</div>
			</div>
		) : (
			''
		)
	);
};

export default Product;
