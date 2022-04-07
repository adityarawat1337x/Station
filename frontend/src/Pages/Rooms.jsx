import React from "react"
import {
  VStack,
  InputGroup,
  Input,
  InputLeftElement,
  HStack,
  Grid,
  Spacer,
} from "@chakra-ui/react"
import { FaSearch } from "react-icons/fa"
import RoomCard from "../Components/Shared/RoomCard"
import CreateRoom from "../Components/CreateRoom/CreateRoom"

const RoomsData = [
  {
    topic: "dawdawdadw",
    members: ["dawdada"],
  },
  {
    topic: "dawdawdadw",
    members: ["dawdada"],
  },
  {
    topic: "dawdawdadw",
    members: ["dawdada"],
  },
  {
    topic: "dawdawdadw",
    members: ["dawdada"],
  },
  {
    topic: "dawdawdadw",
    members: ["dawdada"],
  },
  {
    topic: "dawdawdadw",
    members: ["dawdada"],
  },
  {
    topic: "dawdawdadw",
    members: ["dawdada"],
  },
  {
    topic: "dawdawdadw",
    members: ["dawdada"],
  },
  {
    topic: "dawdawdadw",
    members: ["dawdada"],
  },
]

const Rooms = () => {
  return (
    <VStack>
      <HStack w={["90%", "70%", "60%"]} justifyContent="center">
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<FaSearch />} />
          <Input type="tel" placeholder="Search room" variant="filled" />
        </InputGroup>
        <CreateRoom />
      </HStack>
      <Spacer />
      <Spacer />
      <Spacer />
      <Spacer />
      <Spacer />
      <Spacer />
      <Grid gap="4" templateColumns={["1fr", "repeat(2,1fr)", "repeat(3,1fr)"]}>
        {RoomsData.map((data, idx) => {
          return <RoomCard room={data} idx={idx} />
        })}
      </Grid>
    </VStack>
  )
}

export default Rooms
