import {
  Avatar,
  GridItem,
  Heading,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react"
import React from "react"
import { useHistory } from "react-router-dom"

const RoomCard = (props) => {
  const { room, idx } = props
  const history = useHistory()
  return (
    <GridItem
      onClick={() => history.push(`/room/${room._id}`)}
      rounded="md"
      boxShadow="xl"
      p="4"
      key={idx}
      w="300px"
      h="200px"
    >
      <Spacer />
      <Spacer />
      <Heading size="md" p="2">
        {room.topic}
      </Heading>
      <Spacer />
      <HStack>
        {room.speakers.map((member, idx) => (
          <Avatar key={idx} src={member.avatar}></Avatar>
        ))}
        {room.speakers.map((member, idx) => (
          <Text key={idx}>{member.name}</Text>
        ))}
      </HStack>
    </GridItem>
  )
}

export default RoomCard
