import Link from 'next/link';
import AddToCartButton from '../components/cart/AddToCartButton';
import clientConfig from '../../client-config';
import { isEmpty } from 'lodash';
import Price from "./single-product/price";

const Product = ( props ) => {
	const { product } = props;

	return (
		// @TODO Need to handle Group products differently.
		undefined !== product && 'GroupProduct' !== product.__typename ? (
			<div className="product mb-5">


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
					<h3 className="product-title mt-3 font-medium text-gray-800">
						{ product.name ? product.name : '' }
					</h3>
					<div className="product-description text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: (product?.description)}}/>
					<Price salesPrice={product?.price} regularPrice={product?.regularPrice}/>
					<AddToCartButton product={ product }/>
				</div>

			</div>
		) : (
			''
		)
	);
};

export default Product;
