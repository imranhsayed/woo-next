import Link from 'next/link';
import AddToCartButton from '../components/cart/AddToCartButton';
import clientConfig from '../client-config';

const Product = (props) => {
  const { product } = props;


  

  return (
    // @TODO Need to handle Group products differently.
    undefined !== product && 'GroupProduct' !== product.__typename ? (
      <div className="col-lg-3 col-md-6 col-sm-12">
        <h3 className="card-header text-center">
          {product.name ? product.name : ''}
        </h3>

        <Link
          as={`/product/${product.slug}-${product.productId}`}
          href={`/product?slug=${product.slug}-${product.productId}`}
        >
          <a>
            {product.image ? (
              <img src={product.image.sourceUrl} alt="Product image" />
            ) : (
              <img
                src={clientConfig.productImagePlaceholder}
                alt="Placeholder product image"
              />
            )}
          </a>
        </Link>
        <div className="card-body text-center">
          <h6 className="card-subtitle mb-3">{product.price}</h6>
          <AddToCartButton product={product} />
        </div>
      </div>
    ) : (
      ''
    )
  );
};

export default Product;
