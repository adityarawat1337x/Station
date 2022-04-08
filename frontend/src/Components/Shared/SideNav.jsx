import { useRef } from "react"
import {
  Drawer,
  DrawerBody,
  Input,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  DrawerCloseButton,
  useDisclosure,
  Spacer,
  useColorMode,
  Heading,
  Switch,
  Avatar,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react"
import Navigation from "./Navigation"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../http"
import { setAuth } from "../../store/authSlice"
import { setAvatar, setName } from "../../store/activateSlice"
import styled from "styled-components"

const SideNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { colorMode, toggleColorMode } = useColorMode()
  console.log(colorMode)
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
    <>
      <Avatar
        src={user.avatar}
        size="sm"
        ref={btnRef}
        colorScheme="teal"
        onClick={onOpen}
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {user ? (
              <>
                <Sub spacing="3">
                  <Spacer />
                  <Spacer />
                  <Avatar src={user.avatar} size="lg" />
                  <Spacer />
                  <Heading size="md">{user.name ? user.name : "Guest"}</Heading>
                  <Spacer />
                </Sub>
              </>
            ) : (
              <></>
            )}
            <HStack m="4" justifyContent="center">
              <Text size="sm">{colorMode === "dark" ? "Dark" : "Light"}</Text>
              <Switch onChange={toggleColorMode} />
            </HStack>
          </DrawerHeader>

          <DrawerBody>{/* <Input placeholder="Type here..." /> */}</DrawerBody>

          <DrawerFooter justifyContent="center">
            <Button onClick={logOutUser}>Log out</Button>
          </DrawerFooter>
        </DrawerContent>
        <Navigation />
      </Drawer>
    </>
  )
}

const Sub = styled(VStack)`
  font-size: 1.2rem;
`
export default SideNav
