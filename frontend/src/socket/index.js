import io from "socket.io-client"

const socketInit = () => {
  const opt = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  }
  return io(process.env.REACT_APP_API_URL, opt)
}

export default socketInit
