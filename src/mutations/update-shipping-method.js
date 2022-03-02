import { gql } from "@apollo/client";

/**
 * Update Shipping method.
 *
 * This query is used for updating the selected shipping method option.
 */
export const UpdateShippingMethod = `
  updateShippingMethod(input: $shippingMethod) {
    cart {
      availableShippingMethods {
        packageDetails
        supportsShippingCalculator
        rates {
          id
          cost
          label
        }
      }
      chosenShippingMethods
      shippingTotal
      shippingTax
      subtotal
      subtotalTax
      total
    }
  }
`;

export const UPDATE_SHIPPING_METHOD = gql`
  mutation UPDATE_SHIPPING_METHOD ($shippingMethod: UpdateShippingMethodInput!) {
    ${UpdateShippingMethod}
  }
`;
