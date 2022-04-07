import { useState } from "react"
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalFooter,
  Box,
  HStack,
  Input,
  Spacer,
} from "@chakra-ui/react"
import { MdPublic } from "react-icons/md"
import { RiGitRepositoryPrivateFill } from "react-icons/ri"
import { BsPeopleFill } from "react-icons/bs"
import { createRoom } from "../../http"

const CreateRoom = () => {
  const [roomType, setroomType] = useState("open")
  const [topic, settopic] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()

  const submit = async () => {
    try {
      if (!topic) return
      const { data } = await createRoom({ topic, roomType })
    } catch (e) {
      console.log(e.message)
    }
  }
  return (
    <>
      <Button onClick={onOpen} variant="solid" colorScheme="green">
        New
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent padding="5">
          <ModalHeader>Create a Room</ModalHeader>
          <Text p="4">Topic </Text>

          <Input
            w="80%"
            m="4"
            value={topic}
            placeholder="Name of Topic"
            variant="filled"
            type="text"
            onChange={(e) => settopic(e.target.value)}
          />
          <ModalCloseButton />
          <Spacer />
          <ModalBody>
            <HStack spacing="3">
              <Button
                colorScheme={roomType === "open" ? "green" : "gray.600"}
                color={roomType === "open" ? "blackAlpha" : "whiteAlpha"}
                p="4"
                w="max-content"
                h="20"
                rounded="md"
                boxShadow="xl"
                onClick={() => setroomType("open")}
              >
                <MdPublic />
                <Spacer />
                <Spacer />
                <Text>Public</Text>
              </Button>
              <Button
                colorScheme={roomType === "closed" ? "green" : "gray.600"}
                color={roomType === "closed" ? "blackAlpha" : "whiteAlpha"}
                p="4"
                w="max-content"
                h="20"
                rounded="md"
                boxShadow="xl"
                onClick={() => setroomType("closed")}
              >
                <RiGitRepositoryPrivateFill />
                <Spacer />
                <Spacer />
                <Text> Private</Text>
              </Button>
              <Button
                colorScheme={roomType === "social" ? "green" : "gray.600"}
                color={roomType === "social" ? "blackAlpha" : "whiteAlpha"}
                p="4"
                w="max-content"
                h="20"
                rounded="md"
                boxShadow="xl"
                onClick={() => setroomType("social")}
              >
                i <BsPeopleFill />
                <Spacer />
                <Spacer />
                <Text>Social</Text>
              </Button>
            </HStack>
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center">
            <Button
              colorScheme="green"
              mr={3}
              variant="outline"
              onClick={submit}
            >
              Lets Go 🚀
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateRoom
