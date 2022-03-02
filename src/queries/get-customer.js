import { gql } from "@apollo/client";

export const GetCustomer = `
customer {
  email
  shipping {
    address1
    address2
    city
    company
    country
    email
    firstName
    lastName
    phone
    postcode
    state
  }
}
`;

export const GET_CUSTOMER = gql`
query GET_CUSTOMER {
  ${GetCustomer}
}
`;
