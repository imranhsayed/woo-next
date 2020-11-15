import Layout from "../../components/Layout";
import client from "../../components/ApolloClient";
import Product from "../../components/Product";
import {PRODUCT_BY_CATEGORY_SLUG, PRODUCT_CATEGORIES_SLUGS} from "../../queries/product-by-category";
import {isEmpty} from "lodash";

export default function CategorySingle( props ) {

    const { categoryName, products } = props;

    return (
        <Layout>
            <div className="content-wrap">
                { categoryName ? <h3 className="product-container pl-5">{ categoryName }</h3> : '' }
                <div className="product-container row">
                    { undefined !== products && products?.length ? (
                        products.map( product => <Product key={ product?.id } product={ product } /> )
                    ) : ''}
                </div>
            </div>
        </Layout>
    )
};

export async function getStaticProps(context) {

    const {params: { slug }} = context

    const {data} = await client.query(({
        query: PRODUCT_BY_CATEGORY_SLUG,
        variables: { slug }
    }));

    return {
        props: {
            categoryName: data?.productCategory?.name || '',
            products: data?.productCategory?.products?.nodes || []
        },
        revalidate: 1
    }

}

export async function getStaticPaths () {
    const { data } = await client.query({
        query: PRODUCT_CATEGORIES_SLUGS
    })

    const pathsData = []

    data?.productCategories?.nodes && data?.productCategories?.nodes.map((productCategory) => {
        if (!isEmpty(productCategory?.slug)) {
            pathsData.push({ params: { slug: productCategory?.slug } })
        }
    })

    return {
        paths: pathsData,
        fallback: false
    }
}
