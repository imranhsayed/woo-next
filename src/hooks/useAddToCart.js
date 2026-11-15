import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

import ADD_TO_CART from '../mutations/add-to-cart';
import GET_CART from '../queries/get-cart';
import { useUI } from '../components/context/UIContext';

/**
 * Add a product to the WooCommerce cart.
 *
 * Variable products cannot be added from a card — there is no chosen
 * variation — so those send the shopper to the product page instead, which is
 * what the prototype's "Select options" button does.
 *
 * @return {{addToCart: Function, adding: boolean}}
 */
const useAddToCart = () => {

	const router = useRouter();
	const { toast, openCart } = useUI();

	const [ mutate, { loading: adding } ] = useMutation( ADD_TO_CART, {
		refetchQueries: [ { query: GET_CART } ],
		awaitRefetchQueries: true,
		onError: ( error ) => toast(
			error?.graphQLErrors?.[ 0 ]?.message ?? 'Something went wrong adding that to your bag.',
			{ tone: 'warn' }
		),
	} );

	/**
	 * Add one product to the bag.
	 *
	 * @param {Object} product     Display-ready product.
	 * @param {Object} options     `quantity` and `variationId`.
	 */
	const addToCart = async ( product, options = {} ) => {

		if ( ! product || product.isSoldOut ) {
			return;
		}

		if ( 'EXTERNAL' === product.type && product.externalUrl ) {
			window.open( product.externalUrl, '_blank', 'noopener' );
			return;
		}

		const { quantity = 1, variationId = null } = options;

		// Without a variation there is nothing to add; let the shopper choose one.
		if ( 'VARIABLE' === product.type && ! variationId ) {
			router.push( product.href );
			return;
		}

		const { data } = await mutate( {
			variables: {
				input: {
					clientMutationId: uuidv4(),
					productId: product.databaseId,
					quantity,
					...( variationId ? { variationId } : {} ),
				},
			},
		} );

		if ( ! data?.addToCart?.cartItem ) {
			return;
		}

		toast( `${ product.name } added to your bag`, {
			actionLabel: 'View bag',
			action: openCart,
		} );
	};

	return { addToCart, adding };
};

export default useAddToCart;
