import Link from 'next/link';
import AddToCartButton from '../components/cart/AddToCartButton';
import clientConfig from '../client-config';
import { isEmpty } from 'lodash';

const Product = ( props ) => {
	console.warn(props)
	const { product } = props;

	/**
	 * Get discount percent.
	 * 
	 * @param {String} regularPrice 
	 * @param {String} salesPrice 
	 */
	const discountPercent = ( regularPrice, salesPrice ) => {
		if( isEmpty( regularPrice ) || isEmpty(salesPrice) ) {
			return null;
		}

		const formattedRegularPrice = parseInt( regularPrice?.substring(1) );
		const formattedSalesPrice = parseInt( salesPrice?.substring(1) );
		const discountPercent = ( formattedSalesPrice / formattedRegularPrice ) * 100;

		return {
			discountPercent: formattedSalesPrice !== formattedRegularPrice ? `${discountPercent.toFixed(2)}%` : null,
			strikeThroughClass: formattedSalesPrice < formattedRegularPrice ? 'line-through' : ''
		}
	}

	const productMeta = discountPercent( product?.regularPrice, product?.price );

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
					<h3 className="product-title mt-3 font-medium text-base		">
						{ product.name ? product.name : '' }
					</h3>
					<div className="product-description text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: (product?.description)}}/>
						<h6 className="product-price font-semibold">
							{/* Regular price */}
						{ productMeta?.discountPercent ? <span>{product?.regularPrice}</span> : null }

						{/* Discounted price */}
						<span className={productMeta?.strikeThroughClass}>{ product.price }</span>

						{/* Discount percent */}
						<span>{productMeta?.discountPercent}</span>
						</h6>
					{/* <AddToCartButton product={ product }/> */}
				</div>
			</div>
		) : (
			''
		)
	);
};

export default Product;
