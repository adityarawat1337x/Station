import { Avatar, GridItem, HStack, Spacer, Text } from "@chakra-ui/react"
import React from "react"

const RoomCard = (props) => {
  const { room, idx } = props
  return (
    <GridItem rounded="md" p="4" key={idx} w="300px" h="200px">
      <Spacer />
      <Spacer />
      <Text>{room.topic}</Text>
      <Spacer />
      <HStack>
        {room.members.map((member, idx) => (
          <Avatar key={idx}></Avatar>
        ))}
        {room.members.map((member, idx) => (
          <Text key={idx}> {member}</Text>
        ))}
      </HStack>
    </GridItem>
  )
}

export default RoomCard
