import Link from 'next/link';
import AddToCartButton from '../components/cart/AddToCartButton';
import clientConfig from '../client-config';
import { isEmpty } from 'lodash';

const Product = ( props ) => {

	const { product } = props;

	return (
		// @TODO Need to handle Group products differently.
		undefined !== product && 'GroupProduct' !== product.__typename ? (
			<div className="product">
				

				<Link href={ `/product/${ product.slug }`} >
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
				<div className="product-info">
					<h3 className="product-title">
						{ product.name ? product.name : '' }
					</h3>
					<h6 className="product-price">{ product.price }</h6>
					<AddToCartButton product={ product }/>
				</div>
			</div>
		) : (
			''
		)
	);
};

export default Product;
