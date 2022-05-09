import { Heading, HStack, Text, VStack, Spacer, Button } from "@chakra-ui/react"
import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const LoginCard = (props) => {
  const { title, data, btnText, btnHandler } = props

  return (
    <Card rounded="2xl" boxShadow="2xl" w="400px" h="fit-content">
      <Spacer />
      <Spacer />
      <Heading size="md">{title}</Heading>
      <Spacer />
      {data}
      <Spacer />
      <Button
        variant="solid"
        borderLeftRadius="50px"
        borderRightRadius="50px"
        colorScheme="messenger"
        size="sm"
        onClick={() => {
          btnHandler()
        }}
      >
        {btnText}
      </Button>
      <Spacer />
    </Card>
  )
}

{
  /* <HStack size="sm">
<Text>Already have an account?</Text>
<Text textColor="messenger.400">
  <Link to="/login">Login</Link>
</Text>
</HStack> */
}

const Card = styled(VStack)`
  width: 500px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
`

export default LoginCard
