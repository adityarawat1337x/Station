import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react"
import { useWebRTC } from "../hooks/useWebRTC"
import { useHistory, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { FcLeft } from "react-icons/fc"
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs"
import { useEffect, useState } from "react"
import { getRoom } from "../http"

function Room() {
  const user = useSelector((state) => state.auth.user)
  const { id: roomId } = useParams()
  const [room, setRoom] = useState(null)

  const { clients, provideRef, handleMute } = useWebRTC(roomId, user)

  const history = useHistory()

  const [isMuted, setMuted] = useState(true)

  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await getRoom(roomId)
      setRoom((prev) => data.room)
    }

    fetchRoom()
  }, [roomId])

  useEffect(() => {
    handleMute(isMuted, user._id)
  }, [isMuted])

  const handleMuteClick = (clientId) => {
    if (clientId !== user._id) {
      return
    }
    setMuted((prev) => !prev)
  }

  return (
    <Box overflowY="hidden">
      <Container display={["none", "none", "block"]} maxW="70%">
        <FcLeft onClick={() => history.push("/rooms")} />
        All Rooms
      </Container>
      <Box
        mt={["0em", "2em", "6em"]}
        w="100%"
        p={["5", "10", "20"]}
        borderTopRadius="5%"
        position="fixed"
        h={["60vh", "50vh", "50vh"]}
        bottom="0"
        background="rgba(175,175,175,0.3)"
      >
        <HStack>
          {room ? (
            <Heading fontSize={["md", "lg", "lg"]}>{room.topic}</Heading>
          ) : (
            <Heading fontSize={["md", "lg", "lg"]}>Loading...</Heading>
          )}
          <Spacer />
          <Button
            onClick={() => {
              history.push("/rooms")
            }}
            size={["sm", "sm", "md"]}
            fontSize={["sm", "sm", "md"]}
            variant="ghost"
          >
            🖖 Leave quietly
          </Button>
        </HStack>
        <Spacer mb="10" />
        <HStack>
          {clients.length &&
            clients.map((client, idx) => (
              <Box key={idx} m="3">
                <Spacer />
                <Box position="relative">
                  <Avatar
                    border="4px solid RGB(64, 202, 91)  "
                    src={client.avatar}
                  ></Avatar>
                  <Button
                    position="absolute"
                    left="3"
                    bottom="-2"
                    variant="ghost"
                    border="none"
                    rounded="full"
                    onClick={() => {
                      handleMuteClick(client._id)
                    }}
                  >
                    {client.muted ? <BsFillMicMuteFill /> : <BsFillMicFill />}
                  </Button>
                </Box>
                <Spacer />
                <Text fontSize="lg">{client.name}</Text>
                <audio
                  autoPlay
                  ref={(instance) => provideRef(instance, client._id)}
                ></audio>
              </Box>
            ))}
        </HStack>
      </Box>
    </Box>
  )
}

export default Room
