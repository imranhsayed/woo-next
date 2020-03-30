import Layout from "../components/Layout";
import { withRouter } from 'next/router';
import client from "../components/ApolloClient";
import gql from 'graphql-tag';
import AddToCartButton from "../components/cart/AddToCartButton";
import { ApolloProvider, Mutation } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from '@apollo/react-hooks';

/**
 * Login user mutation query.
 */
const ADD_TO_CART = gql`
  mutation ($input: AddToCartInput!) {
    addToCart(input: $input ) {
      cartItem {
        key
        product {
          id
          productId
          name
          description
          type
          onSale
          slug
          averageRating
          reviewCount
          image {
            id
            sourceUrl
            altText      
          }
          galleryImages {
            nodes {
              id
              sourceUrl
              altText
            }
          }

        }
        variation {
          id
          variationId
          name
          description
          type
          onSale
          price
          regularPrice
          salePrice
          image {
            id
            sourceUrl
            altText      
          }
          attributes {
            nodes {
              id
              attributeId
              name
              value
            }
          }
        }
        quantity
        total
        subtotal
        subtotalTax
      }
    }
  }
`;

const Product = ( props ) => {

	const { product } = props;

	/**
	 * Handles user login.
	 *
	 * @param {object} event Event Object.
	 * @param {object} addToCart login function from login mutation query.
	 * @return {void}
	 */
	const handleAddToCart = async ( event, addToCart, productId ) => {

		if ( process.browser ) {

			event.preventDefault();

			const productID = parseInt( productId );
			
			console.warn( 'pro', productID );

			// If the data is valid.
			if ( productId ) {

				await addToCart( {
					variables: {
						input: {
							clientMutationId: 'myId',
							productId: productID,
							quantity: 1
						}
					} } )
					.then( response => {
						console.warn( 'respo', response );
					} )
					.catch( err => {
						console.warn( 'err', err.graphQLErrors[ 0 ].message );
					} );

			}

		}

	};

	return (
		<ApolloProvider client={ client }>
			<ApolloHooksProvider client={client}>
			<Mutation mutation={ ADD_TO_CART }>
				{ ( addToCart, { loading, error } ) => (
				<div className="woo-next-single">
					<div className="woo-next-single__product card bg-light mb-3 p-5">
						<div className="card-header">{ product.name }</div>
						<div className="card-body">
							<h4 className="card-title">{ product.name }</h4>
							<img src={ product.image.sourceUrl } alt="Product Image" width="200" srcSet={ product.image.srcSet }/>
							<p className="card-text">{ product.description }</p>
							<button onClick={ ( event ) => handleAddToCart( event, addToCart, product.productId ) }>Add To Cart</button>
							{/*<AddToCartButton product={ product }/>*/}
						</div>
					</div>
				</div>
				)}
			</Mutation>
			</ApolloHooksProvider>
		</ApolloProvider>

	)
};

Product.getInitialProps = async function( context ) {

	let { query: { slug } } = context;
	const id = slug ? parseInt( slug.split( '-' ).pop() ) : context.query.id;

	const PRODUCT_QUERY = gql` query Product( $id: ID! ) {
			product ( id: $id, idType: DATABASE_ID ) {
							id
							productId
							averageRating
							slug
							description
							image {
								uri
								title
								srcSet
								sourceUrl
							}
							name
						  ... on SimpleProduct {
					        price
					        id
					      }
					      ... on VariableProduct {
					        price
					        id
					      }
					      ... on ExternalProduct {
					        price
					        id
					      }
					      ... on GroupProduct {
					        products {
					          nodes {
					            ... on SimpleProduct {
					              price
					            }
					          }
					        }
					        id
					      }
					    }



	 }`;

	const res = await client.query(({
		query: PRODUCT_QUERY,
		variables: { id }
	}));

	return {
		product: res.data.product
	}

};


export default Product;
