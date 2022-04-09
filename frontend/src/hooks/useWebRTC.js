import { useRef, useEffect, useCallback } from "react"
import useStateWithcallback from "./useStateWithcallback"
import { socketInit } from "../socket"
import { Actions } from "../actions"
function useWebRTC(roomId, user) {
  const [clients, setClients] = useStateWithcallback([])
  const audioElements = useRef({})
  const connections = useRef({})
  const localMediaStream = useRef(null)
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = socketInit()
  }, [])
  const addNewClients = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client.id === newClient.id)
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb)
      }
    },
    [clients, setClients]
  )

  //?capture audio
  useEffect(() => {
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
    }

    startCapture().then(() => {
      addNewClients(user, () => {
        const localElement = audioElements.current[user.id]
        if (localElement) {
          localElement.volume = 0
          localElement.srcObject = localMediaStream.current
        }
      })

      //?socket emit

      socketRef.current.emit(Actions.JOIN, { roomId, user })
    })
  })
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance
  }
  return [clients, provideRef]
}

export default useWebRTC
