import {
  Avatar,
  Box,
  Button,
  AspectRatio,
  Heading,
  HStack,
  Grid,
  GridItem,
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
    <Box>
      <Box
        mt={["0em", "2em", "6em"]}
        w="100%"
        p={["5", "10", "20"]}
        borderTopRadius="1%"
        position="fixed"
        h="90vh"
        //h={["60vh", "50vh", "50vh"]}
        bottom="0"
        background="rgba(175,175,175,0.3)"
      >
        <HStack>
          {room ? (
            <Heading fontSize={["md", "xl", "2xl"]}>{room.topic}</Heading>
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
        <Grid minChildWidth="300px" gap={6}>
          {clients.length &&
            clients.map((client, idx) => (
              <GridItem maxW="400px" position="relative" key={idx} m="3">
                <AspectRatio maxW="400px" ratio={1 / 1}>
                  <video
                    autoPlay
                    style={{
                      transform: "rotateY(180deg)",
                      borderRadius: "10%",
                    }}
                    ref={(instance) => provideRef(instance, client._id)}
                  ></video>
                </AspectRatio>
                <Button
                  position="absolute"
                  bottom="15px"
                  left="40%"
                  rounded="full"
                  onClick={() => {
                    handleMuteClick(client._id)
                  }}
                >
                  {client.muted ? <BsFillMicMuteFill /> : <BsFillMicFill />}
                </Button>
              </GridItem>
            ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Room
