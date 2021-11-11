import { Flex, Heading, Input, Button, FormControl, FormLabel } from "@chakra-ui/react"
import { getCsrfToken, getSession } from "next-auth/react"
import Header from '../../../src/components/Header'


export default function SignIn({ csrfToken }) {
  return (
    <>
      <Header />
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Flex direction="column" p={12}>
          <Heading mb={6}>Sign In</Heading>
          <form method="post" action="/api/auth/callback/credentials">
            <Input variant="filled" name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input variant="filled" name="email" type="email" />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input variant="filled" name="password" type="password" />
            </FormControl>
            <Button width="100%" colorScheme="teal" type="submit" mt={3}>Sign in</Button>
          </form>
        </Flex>
      </Flex>
    </>
  )
}

export async function getServerSideProps(context) {
  const { req } = context
  const session = await getSession({ req })

  if ( session ) {
    return {
      redirect: { destination: "/" }
    }
  }
  return {
    props: {
      csrfToken: await getCsrfToken(context)
    },
  }
}