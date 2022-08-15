import React from "react"
import { Heading, Spinner, VStack, Spacer, Box, Center } from "@chakra-ui/react"
import styled from "styled-components"

function Loader({ message }) {
  return (
    <Center w="100%" h="100%">
      <Card rounded="2xl" w="400px" h="200px">
        <Spacer />
        <Spinner />
        <Spacer />
        <Heading size="md">{message}</Heading>
        <Spacer />
      </Card>
    </Center>
  )
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

export default Loader
