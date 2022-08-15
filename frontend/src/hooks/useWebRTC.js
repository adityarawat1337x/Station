import { useEffect, useRef, useCallback } from "react"
import { Actions } from "../actions"
import socketInit from "../socket"
import freeice from "freeice"
import useStateWithcallback from "./useStateWithcallback"

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithcallback([])
  const audioElements = useRef({})
  const connections = useRef({})
  const socket = useRef(null)
  const localMediaStream = useRef(null)
  const clientsRef = useRef(null)

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client._id === newClient._id)
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb)
      }
    },
    [clients, setClients]
  )

  useEffect(() => {
    clientsRef.current = clients
  }, [clients])

  useEffect(() => {
    let conn = connections.current
    let audi = audioElements.current

    const initChat = async () => {
      socket.current = socketInit()
      await captureMedia()

      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user._id]

        if (localElement) {
          localElement.volume = 0
          localElement.srcObject = localMediaStream.current
        }
      })

      socket.current.on(Actions.ADD_PEER, handleNewPeer)
      socket.current.on(Actions.REMOVE_PEER, handleRemovePeer)
      socket.current.on(Actions.ICE_CANDIDATE, handleIceCandidate)
      socket.current.on(Actions.SESSION_DESCRIPTION, setRemoteMedia)

      socket.current.on(Actions.MUTE, ({ peerId, userId }) => {
        handleSetMute(true, userId)
      })
      socket.current.on(Actions.UNMUTE, ({ peerId, userId }) => {
        handleSetMute(false, userId)
      })

      //Join the socket room
      socket.current.emit(Actions.JOIN, {
        roomId,
        user,
      })

      async function captureMedia() {
        // Start capturing local audio stream.
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        })
      }

      async function handleNewPeer({ peerId, createOffer, user: remoteUser }) {
        if (peerId in connections.current) {
          return console.warn(
            `You are already connected with ${peerId} (${user.name})`
          )
        }

        // Store it to connections
        connections.current[peerId] = new RTCPeerConnection({
          // iceServers: freeice(),
          iceServers: [
            {
              urls: "stun:openrelay.metered.ca:80",
            },
            {
              urls: "turn:openrelay.metered.ca:80",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
            {
              urls: "turn:openrelay.metered.ca:443",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
            {
              urls: "turn:openrelay.metered.ca:443?transport=tcp",
              username: "openrelayproject",
              credential: "openrelayproject",
            },
          ],
        })

        // Handle new ice candidate on this peer connection
        connections.current[peerId].onicecandidate = (event) => {
          socket.current.emit(Actions.RELAY_ICE, {
            peerId,
            iceCandidate: event.candidate,
          })
        }

        // Handle on track event on this connection
        connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
          addNewClient({ ...remoteUser, muted: true }, () => {
            // get current users mute info
            const currentUser = clientsRef.current.find(
              (client) => client._id === user._id
            )
            if (currentUser) {
              socket.current.emit(Actions.MUTE_INFO, {
                userId: user._id,
                roomId,
                isMute: currentUser.muted,
              })
            }

            if (audioElements.current[remoteUser._id]) {
              audioElements.current[remoteUser._id].srcObject = remoteStream
            } else {
              let settled = false
              const interval = setInterval(() => {
                if (audioElements.current[remoteUser._id]) {
                  audioElements.current[remoteUser._id].srcObject = remoteStream
                  settled = true
                }

                if (settled) {
                  clearInterval(interval)
                }
              }, 300)
            }
          })
        }

        // Add connection to peer connections track
        localMediaStream.current.getTracks().forEach((track) => {
          connections.current[peerId].addTrack(track, localMediaStream.current)
        })

        // Create an offer if required
        if (createOffer) {
          const offer = await connections.current[peerId].createOffer()

          // Set as local description
          await connections.current[peerId].setLocalDescription(offer)

          // send offer to the server
          socket.current.emit(Actions.RELAY_SDP, {
            peerId,
            sessionDescription: offer,
          })
        }
      }
      async function handleRemovePeer({ peerId, userId }) {
        if (connections.current[peerId]) {
          connections.current[peerId].close()
        }

        delete connections.current[peerId]
        delete audioElements.current[peerId]

        setClients((list) => list.filter((c) => c._id !== userId))
      }
      async function handleIceCandidate({ peerId, iceCandidate }) {
        if (iceCandidate) {
          connections.current[peerId].addIceCandidate(iceCandidate)
        }
      }
      async function setRemoteMedia({
        peerId,
        sessionDescription: remoteSessionDescription,
      }) {
        connections.current[peerId].setRemoteDescription(
          new RTCSessionDescription(remoteSessionDescription)
        )
        // If session descrition is offer then create an answer
        if (remoteSessionDescription.type === "offer") {
          const connection = connections.current[peerId]
          const answer = await connection.createAnswer()
          connection.setLocalDescription(answer)
          socket.current.emit(Actions.RELAY_SDP, {
            peerId,
            sessionDescription: answer,
          })
        }
      }

      async function handleSetMute(mute, userId) {
        const clientIdx = clientsRef.current
          .map((client) => client._id)
          .indexOf(userId)
        const allConnectedClients = JSON.parse(
          JSON.stringify(clientsRef.current) // clone
        )
        if (clientIdx > -1) {
          allConnectedClients[clientIdx].muted = mute
          setClients(allConnectedClients)
        }
      }
    }

    initChat()

    return () => {
      localMediaStream.current.getTracks().forEach((track) => track.stop())
      socket.current.emit(Actions.LEAVE, { roomId })
      for (let peerId in conn) {
        conn[peerId].close()
        delete conn[peerId]
        delete audi[peerId]
      }
      socket.current.off(Actions.ADD_PEER)
      socket.current.off(Actions.REMOVE_PEER)
      socket.current.off(Actions.ICE_CANDIDATE)
      socket.current.off(Actions.SESSION_DESCRIPTION)
      socket.current.off(Actions.MUTE)
      socket.current.off(Actions.UNMUTE)
    }
  }, [])

  const handleMute = (mute, userId) => {
    let settled = false
    if (userId === user._id) {
      let interval = setInterval(() => {
        if (localMediaStream.current) {
          localMediaStream.current.getTracks()[0].enabled = !mute
          if (mute) {
            socket.current.emit(Actions.MUTE, {
              userId: user._id,
              roomId,
            })
          } else {
            socket.current.emit(Actions.UNMUTE, {
              userId: user._id,
              roomId,
            })
          }
          settled = true
        }
        if (settled) {
          clearInterval(interval)
        }
      }, 100)
    }
  }

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance
  }

  return {
    clients,
    provideRef,
    handleMute,
  }
}
