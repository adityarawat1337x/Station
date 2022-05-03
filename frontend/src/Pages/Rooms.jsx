import { useState, useEffect } from "react"
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
import Loader from "../Components/Shared/Loader"
import { getRooms } from "../http"

const Rooms = () => {
  const [RoomsData, setRoomsData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRooms()
      setRoomsData(data.data.rooms)
    }
    fetchData()
  }, [])

  return (
    <VStack>
      <HStack w={["90%", "70%", "60%"]} justifyContent="center">
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<FaSearch />} />
          <Input type="tel" placeholder="Search room" variant="filled" />
        </InputGroup>
        <CreateRoom />
      </HStack>
      {RoomsData[0] ? (
        <>
          <Spacer />
          <Spacer />
          <Spacer />
          <Spacer />
          <Spacer />
          <Spacer />
          <Grid
            gap="4"
            templateColumns={["1fr", "repeat(2,1fr)", "repeat(3,1fr)"]}
          >
            {RoomsData.map((data, idx) => {
              return <RoomCard room={data} key={idx} />
            })}
          </Grid>
        </>
      ) : (
        <Loader message="Fetching Rooms.." />
      )}
    </VStack>
  )
}

export default Rooms
