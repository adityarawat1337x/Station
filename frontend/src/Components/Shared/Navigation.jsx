import React from "react"
import { Link } from "react-router-dom"
import {
  Flex,
  Spacer,
  Box,
  useColorMode,
  HStack,
  Heading,
  Switch,
  Avatar,
} from "@chakra-ui/react"
import { Icon } from "@chakra-ui/react"
import styled from "styled-components"
import { FcMindMap } from "react-icons/fc"

const Navigation = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Navbar pl="10" pr="10" pt="5" pb="5" w="100%" align="center">
      <Main>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon as={FcMindMap} />{" "}
          <Heading display={["none", "none", "block"]} size="lg">
            {" Codehouse"}
          </Heading>
        </Link>
      </Main>
      <Spacer />
      <Sub spacing="3">
        <Spacer />
        <Heading size="md" display={["none", "none", "block"]}>
          John Doe
        </Heading>
        <Spacer />
        <Avatar size="sm" />
        <Spacer />
        <Switch
          position="absolute"
          top="90vh"
          right="2vw"
          onChange={toggleColorMode}
        />
      </Sub>
    </Navbar>
  )
}

const Navbar = styled(Flex)`
  font-size: 1.2rem;
`
const Main = styled(Box)`
  font-size: 1.5rem;
  align-items: center;
  justify-content: center;
`
const Sub = styled(HStack)``
export default Navigation
