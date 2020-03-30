import { gql } from 'apollo-boost';
import get from 'lodash/get';
import find from 'lodash/find';
import { GET_CART } from './use-cart-mutation';
export const typeDefs = gql`
  extend type Query {
    isInCart(productId: Int!, variationId: Int): Boolean!
    getCartItem(productId: Int!, variationId: Int): CartItem
  }
`;
const cartItemFilter = (productId, variationId) => ({ product, variation }) => {
	if (productId !== product.productId) {
		return false;
	}
	if (variation && variationId !== variation.variationId) {
		return false;
	}
	return true;
};
export const resolvers = {
	Query: {
		isInCart: (_, { productId, variationId }, { cache }) => {
			if ( ! cache.readQuery({ query: GET_CART }) ) {
				return null;
			}
			const { cart } = cache.readQuery({ query: GET_CART });
			const items = get(cart, 'contents.nodes') || [];
			const item = find(items, (cartItemFilter(productId, variationId)));
			return !!item;
		},
		getCartItem: (_, { productId, variationId }, { cache }) => {
			if ( ! cache.readQuery({ query: GET_CART }) ) {
				return null;
			}
			const { cart } = cache.readQuery({ query: GET_CART });
			const items = get(cart, 'contents.nodes') || [];
			return find(items, (cartItemFilter(productId, variationId)));
		},
	},
};
