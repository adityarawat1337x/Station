import { Text } from "@chakra-ui/react"
import useWebRTC from "../hooks/useWebRTC"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
function Room() {
  const { id: roomId } = useParams()
  const user = useSelector((state) => state.auth.user)
  const [clients, provideRef] = useWebRTC(roomId, user)

  console.log(clients)
  return (
    <div>
      <Text>All connected clients</Text>
      {clients &&
        clients.map((client, idx) => (
          <div key={idx}>
            <audio
              controls
              autoPlay
              ref={(instance) => provideRef(instance, client.id)}
            ></audio>
            <h1>{client.name}</h1>
          </div>
        ))}
    </div>
  )
}

export default Room
