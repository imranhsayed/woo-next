import { gql } from "@apollo/client";

/**
 * Apply a coupon.
 *
 * WooCommerce rejects an unknown or ineligible code with a GraphQL error whose
 * message is HTML, so callers should run it through `toPlainMessage`.
 */
export const APPLY_COUPON = gql`
mutation APPLY_COUPON($input: ApplyCouponInput!) {
  applyCoupon(input: $input) {
    clientMutationId
  }
}
`;

/** Remove one or more applied coupons. */
export const REMOVE_COUPONS = gql`
mutation REMOVE_COUPONS($input: RemoveCouponsInput!) {
  removeCoupons(input: $input) {
    clientMutationId
  }
}
`;

/** Choose a shipping rate for the cart. */
export const UPDATE_SHIPPING_METHOD = gql`
mutation UPDATE_SHIPPING_METHOD($input: UpdateShippingMethodInput!) {
  updateShippingMethod(input: $input) {
    clientMutationId
  }
}
`;

/**
 * Set the customer's shipping country.
 *
 * Shipping rates come from the zone the address falls in, so the cart's
 * delivery estimate only reflects a country once it is stored on the session.
 */
export const UPDATE_SHIPPING_COUNTRY = gql`
mutation UPDATE_SHIPPING_COUNTRY($input: UpdateCustomerInput!) {
  updateCustomer(input: $input) {
    customer {
      shipping {
        country
      }
    }
  }
}
`;
