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
  HStack,
  Input,
  Spacer,
} from "@chakra-ui/react"
import { MdPublic } from "react-icons/md"
import { RiGitRepositoryPrivateFill } from "react-icons/ri"
import { BsPeopleFill } from "react-icons/bs"
import { createRoom } from "../../http"
import { useHistory } from "react-router-dom"

const CreateRoom = () => {
  const [roomType, setroomType] = useState("open")
  const [topic, settopic] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const history = useHistory()
  const submit = async () => {
    try {
      if (!topic) return
      const { data } = await createRoom({ topic, roomType })
      console.log(data)
      onClose()
      history.push(`/room/${data.room._id}`)
    } catch (e) {
      console.log(e.message)
    }
  }
  return (
    <>
      <Button onClick={onOpen} variant="solid" colorScheme="green">
        New
      </Button>
      <Modal
        isCentered
        motionPreset="slideInBottom"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay backdropFilter="auto" backdropBlur="2px" />
        <ModalContent padding="5">
          <ModalHeader>Create a Room</ModalHeader>
          <Text p="4">Topic of discussion</Text>
          <Input
            w="80%"
            ml="4"
            value={topic}
            placeholder="Name of Topic"
            variant="filled"
            type="text"
            onChange={(e) => settopic(e.target.value)}
          />
          <ModalCloseButton />
          <ModalBody>
            <HStack mt="4" spacing="3">
              <Button
                colorScheme={roomType === "open" ? "green" : "gray.600"}
                color={roomType === "open" ? "blackAlpha" : "whiteAlpha"}
                p="4"
                w="max-content"
                h={["10", "15", "20"]}
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
                h={["10", "15", "20"]}
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
                h={["10", "15", "20"]}
                rounded="md"
                boxShadow="xl"
                onClick={() => setroomType("social")}
              >
                <BsPeopleFill />
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
