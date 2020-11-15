import Layout from '../../components/Layout';
//import { useRouter } from 'next/router';
import client from '../../components/ApolloClient';
import AddToCartButton from '../../components/cart/AddToCartButton';
import {PRODUCT_BY_SLUG_QUERY, PRODUCT_SLUGS} from '../../queries/product-by-slug';
import clientConfig from '../../client-config';
import { isEmpty } from 'lodash';

export default function Product(props) {
	const { product } = props;

	//const router = useRouter()
    //const { slug } = router.query
	// console.log(slug)  /* check the slug */


	return (
		<Layout>
			{ product ? (
				<div className="woo-next-single">
					<div className="woo-next-single__product card bg-light mb-3 p-5">
						<div className="card-header">{ product.name }</div>
						<div className="card-body">
							<h4 className="card-title">{ product.name }</h4>
							{ !isEmpty( product.image ) ? (
								<img
									src={ product.image.sourceUrl }
									alt="Product Image"
									width="200"
									srcSet={ product.image.srcSet }
								/>
							) : !isEmpty( clientConfig.singleImagePlaceholder ) ? (
								<img
									src={ clientConfig.singleImagePlaceholder }
									alt="Placeholder product image"
								/>
							) : null }
							<div
								dangerouslySetInnerHTML={ {
									__html: product.description,
								} }
								className="card-text"
							/>

							<AddToCartButton product={ product }/>
						</div>
					</div>
				</div>
			) : (
				''
			) }
		</Layout>
	);
};


export async function getStaticProps(context) {

    const {params: { slug }} = context

    const {data} = await client.query({
        query: PRODUCT_BY_SLUG_QUERY,
        variables: { slug }
    })

    return {
        props: {
            product: data?.product || {},
        },
        revalidate: 1
    };
}

export async function getStaticPaths () {
    const { data } = await client.query({
        query: PRODUCT_SLUGS
    })

    const pathsData = []

    data?.products?.nodes && data?.products?.nodes.map((product) => {
        if (!isEmpty(product?.slug)) {
            pathsData.push({ params: { slug: product?.slug } })
        }
    })

    return {
        paths: pathsData,
        fallback: false
    }
}
