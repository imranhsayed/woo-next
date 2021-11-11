import { Flex, Heading, Input, Button } from "@chakra-ui/react"

const SignUp = () => {
  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" p={12}>
        <Heading mb={6}>Sign up</Heading>
        <Input placeholder="burduli94@gmail.com" variant="filled" mb={3} type="email"></Input>
        <Input variant="filled" mb={3} type="password"></Input>
        <Input variant="filled" mb={3} type="password"></Input>
        <Button colorScheme="teal" mb={3}>Sign up</Button>
      </Flex>
    </Flex>
  )
}

export default SignUp