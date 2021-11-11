import { Flex, Heading, Input, Button } from "@chakra-ui/react"
import Header from '../../../src/components/Header'

const SignUp = () => {
  return (
    <>
      <Header />
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex direction="column" p={12}>
          <Heading mb={6}>Sign up</Heading>
          <Input placeholder="burduli94@gmail.com" variant="filled" mb={3} type="email"></Input>
          <Input variant="filled" mb={3} type="password"></Input>
          <Input variant="filled" mb={3} type="password"></Input>
          <Button colorScheme="teal" mb={3}>Sign up</Button>
        </Flex>
      </Flex>
    </>
  )
}

export default SignUp

export async function getStaticProps() {
  const REGISTER_USER = gql `mutation RegisterUser($username: String!, $password: String!, $email: String! ) {
    registerUser(
      input: {
          clientMutationId: "uniqueId",
          username: $username,
          password: $password,
          email: $email
      }) {
      user {
        jwtAuthToken
        jwtRefreshToken
      }
    }
  }
  `
  const { data: headerFooterData } = await axios.get( HEADER_FOOTER_ENDPOINT )
  const { data: products } = await getProductsData()

  return {
    props: {
      headerFooter: headerFooterData?.data ?? {},
      products: products ?? {}
    },
    revalidate: 1,
  };
}