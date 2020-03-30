import { useMutation, useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
// @TODO verifiy this.
import v4 from 'uuid/v4';

export const GET_CART = gql`
  query getCart {
    cart {
      contents {
        nodes {
          key
          product {
            id
            productId
            name
            description
            type
            onSale
            price
            regularPrice
            salePrice
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
            defaultAttributes {
              nodes {
                id
                attributeId
                name
                value
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
      appliedCoupons {
        nodes {
          couponId
          discountType
          amount
          dateExpiry
          products {
            nodes {
              id
            }
          }
          productCategories {
            nodes {
              id
            }
          }
        }
      }
      subtotal
      subtotalTax
      shippingTax
      shippingTotal
      total
      totalTax
      feeTax
      feeTotal
      discountTax
      discountTotal
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation ($input: AddToCartInput!) {
    addToCart(input: $input) {
      cartItem {
        key
        product {
          id
          productId
          name
          description
          type
          onSale
          price
          regularPrice
          salePrice
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
          defaultAttributes {
            nodes {
              id
              attributeId
              name
              value
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

export const UPDATE_ITEM_QUANTITIES = gql`
  mutation ($input: UpdateItemQuantitiesInput!) {
    updateItemQuantities(input: $input) {
      items {
        key
        product {
          id
          productId
          name
          description
          type
          onSale
          price
          regularPrice
          salePrice
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
          defaultAttributes {
            nodes {
              id
              attributeId
              name
              value
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
      removed {
        key
        product {
          id
          productId
        }
        variation {
          id
          variationId
        }
      }
      updated {
        key
        product {
          id
          productId
        }
        variation {
          id
          variationId
        }
      }
    }
  }
`;

export const CHECK_CART = gql`
  query checkCart($productId: Int!, $variationId: Int) {
    isInCart(productId: $productId, variationId: $variationId) @client
    getCartItem(productId: $productId, variationId: $variationId) @client
  }
`;

const useCartMutations = (productId, variationId) => {
	const { data: cartData } = useQuery(CHECK_CART, { variables: { productId, variationId } });

	const [addToCart] = useMutation(ADD_TO_CART, {
		update(cache, { data: { addToCart: { cartItem } } }) {
			const { cart } = cache.readQuery({ query: GET_CART });
			const { contents } = cart;
			contents.nodes.push(cartItem);
			cache.writeQuery({
				query: GET_CART,
				data: { cart: { ...cart, contents } },
			});
		},
		refetchQueries: ({ data }) => {
			const { product, variation } = data.addToCart.cartItem;

			return [{
				query: CHECK_CART,
				variables: {
					productId: product.productId,
					variationId: variation ? variation.variationId : null,
				},
			}];
		},
	});

	const [updateItemQuantities] = useMutation(UPDATE_ITEM_QUANTITIES, {
		update(cache, { data: { updateItemQuantities: { items } } }) {
			const { cart } = cache.readQuery({ query: GET_CART });
			const contents = { ...cart.contents, nodes: items };
			cache.writeQuery({
				query: GET_CART,
				data: { cart: { ...cart, contents } },
			});
		},
		refetchQueries: ({ data }) => {
			const { updated, removed } = data.updateItemQuantities;
			console.log(data);
			const mapper = ({ product, variation }) => ({
				query: CHECK_CART,
				variables: {
					productId: product.productId,
					variationId: variation ? variation.variationId : null,
				},
			});

			return [
				...updated.map(mapper),
				...removed.map(mapper),
			];
		},
	});

	return {
		itemInCart: cartData && cartData.isInCart ? cartData.getCartItem : false,
		addToCart: (id, quantity, vId, variation, options = {}) => addToCart({
			variables: {
				input: {
					clientMutationId: v4(),
					productId: id,
					quantity,
					variationId: vId,
					variation,
				},
			},
			...options,
		}),
		updateItemQuantities: (cartData && cartData.getCartItem)
			? (quantity, options = {}) => updateItemQuantities({
				variables: {
					input: {
						clientMutationId: v4(),
						items: [
							{ key: cartData.getCartItem.key, quantity },
						],
					},
				},
				...options,
			})
			: (items, options) => updateItemQuantities({
				variables: {
					input: {
						clientMutationId: v4(),
						items,
					},
				},
				...options,
			}),
	};
}

export default useCartMutations;
