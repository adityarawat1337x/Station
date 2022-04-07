import React from "react"
import { Link } from "react-router-dom"
import { Flex, Spacer, Box, Heading } from "@chakra-ui/react"
import { Icon } from "@chakra-ui/react"
import styled from "styled-components"
import { FcMindMap } from "react-icons/fc"
import SideNav from "./SideNav"

const Navigation = () => {
  return (
    <Navbar pl="5" pr="5" pt="5" pb="5" w="100%" align="center">
      <Main>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon display={["none", "none", "block"]} as={FcMindMap} mr="10px" />
          <Heading display={["none", "none", "block"]} size="lg">
            {" CodeHouse"}
          </Heading>
        </Link>
      </Main>
      <Spacer />
      <SideNav />
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

export default Navigation
