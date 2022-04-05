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
  Button,
} from "@chakra-ui/react"
import { Icon } from "@chakra-ui/react"
import styled from "styled-components"
import { FcMindMap } from "react-icons/fc"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../http"
import { setAuth } from "../../store/authSlice"
import { setAvatar, setName } from "../../store/activateSlice"
const Navigation = () => {
  const dispatch = useDispatch()
  const { name, avatar } = useSelector((state) => state.activate)
  const { colorMode, toggleColorMode } = useColorMode()

  const logOutUser = async () => {
    try {
      const { data } = await logout()
      console.log(data)
      dispatch(setAuth(data))
      dispatch(setName(null))
      dispatch(setAvatar(null))
    } catch (err) {
      console.log(err)
    }
  }

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
          <Icon as={FcMindMap} mr="10px" />
          <Heading display={["none", "none", "block"]} size="lg">
            {" CodeHouse"}
          </Heading>
        </Link>
      </Main>
      <Spacer />
      {name && avatar ? (
        <>
          <Sub spacing="3">
            <Spacer />
            <Heading size="md" display={["none", "none", "block"]}>
              {name ? name : "Guest"}
            </Heading>
            <Spacer />
            <Avatar src={avatar} size="sm" />
            <Spacer />
            <Switch
              position="absolute"
              top="90vh"
              right="2vw"
              onChange={toggleColorMode}
            />
          </Sub>
          <Button onClick={logOutUser}>Log Out</Button>
        </>
      ) : (
        <></>
      )}
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

const Sub = styled(HStack)`
  font-size: 1.2rem;
`

export default Navigation
