// variable-cart-options.jsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Button from '@kiwicom/orbit-components/lib/Button';
import ListChoice from '@kiwicom/orbit-components/lib/ListChoice';
import InputField from '@kiwicom/orbit-components/lib/InputField';
import Remove from '@kiwicom/orbit-components/lib/icons/Remove';
import Loading from '@kiwicom/orbit-components/lib/Loading';
import Stack from '@kiwicom/orbit-components/lib/Stack';
import get from 'lodash/get';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import useCartMutations from './use-cart-mutation';

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const GET_VARIATIONS = gql`
  query($id: ID!) {
    product(id: $id) {
      variations {
        nodes {
          id
          variationId
          name
          stockStatus
          price
          attributes {
            nodes {
              id
              name
              value
            }
          }
        }
      }
    }
  }
`;

/**
 * Renders cart options form for "variable" products
 *
 * @param {string} id  Relay global ID.
 * @param {number} productId  WP Product ID.
 * @param {boolean} soldIndividually  Whether this product such be sold individually or in bulk.
 */
const VariableCartOptions = ({ id, productId, soldIndividually }) => {
	const [quantity, setQuantity]              = useState( 1 );
	const [variationId, setVariationId]        = useState( null );
	const [variationAttributes, setAttributes] = useState( null );
	const selectVariation                      = ( variation ) => {
		setVariationId( variation.variationId );

		const attributes = variation.attributes.nodes.map( ( { name, value } ) => ( {
			attribute: name,
			attributeTerm: value,
		} ) );
		setAttributes( attributes );
	};

	const { data, error, loading } = useQuery( GET_VARIATIONS, {
		variables: 27,
		onCompleted: ( results ) => selectVariation( get( results, 'product.variations.nodes[0]' ) ),
	} );

	const { itemInCart, addToCart, updateItemQuantities } = useCartMutations( productId, variationId );

	useEffect( () => {
		console.log( itemInCart );
		if ( itemInCart ) {
			setQuantity( itemInCart.quantity );
		}
	}, [itemInCart] );

	const onSubmit = ( e ) => {
		e.preventDefault();
		if ( itemInCart ) {
			updateItemQuantities( quantity );
		} else {
			addToCart( productId, quantity, variationId, variationAttributes );
		}
	};

	const removeItem = () => updateItemQuantities( 0 );

	if ( loading || variationId === null ) {
		return <Loading type="boxLoader"/>;
	}
	if ( error ) {
		return <div>{ `Error! ${ error.message }` }</div>;
	}

	const variations = data.product.variations.nodes;

	return (
		<Form onSubmit={onSubmit}>
			{variations.map((variation) => (
				<ListChoice
					key={variation.id}
					title={variation.name}
					description={variation.price || undefined}
					selectable={variation.stockStatus === 'IN_STOCK'}
					selected={variationId === variation.variationId}
					onClick={() => selectVariation(variation)}
				/>
			))}
			{variations.length && (
				<>
					<Stack flex={['0 0 auto', '1 1 70%', '1 0 20%']}>
						{!soldIndividually && (
							<InputField
								type="number"
								value={quantity}
								placeholder="Quantity"
								onChange={(e) => setQuantity(e.target.value)}
							/>
						)}
						{itemInCart ? (
							<>
								<Button type="primary" submit>Update Quantity</Button>
								<Button icon={<Remove />} type="critical" onClick={removeItem} />
							</>
						) : (
							<Button type="primary" submit>Add To Cart</Button>
						)}
					</Stack>
				</>
			)}
		</Form>
	);
};

VariableCartOptions.propTypes = {
	id: PropTypes.string.isRequired,
	productId: PropTypes.number.isRequired,
	soldIndividually: PropTypes.bool,
};

VariableCartOptions.defaultProps = {
	soldIndividually: false,
};

export default VariableCartOptions;
