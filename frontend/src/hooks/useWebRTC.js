import { useRef, useEffect, useCallback } from "react"
import useStateWithcallback from "./useStateWithcallback"
import socketInit from "../socket"
import { Actions } from "../actions"
import freeice from "freeice"

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithcallback([])
  const audioElements = useRef({})
  const connections = useRef({})
  const socketRef = useRef(null)
  const localMediaStream = useRef(null)
  const clientsRef = useRef(null)

  const addNewClient = useCallback(
    (newClient, cb) => {
      let lookingFor
      if (clients.length !== 0) {
        lookingFor = clients.find((client) => client.id === newClient.id)
      }
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb)
      }
    },
    [clients, setClients]
  )

  useEffect(() => {
    clientsRef.current = clients
  }, [clients])

  //Handle new ice candidates
  async function handleIceCandidate({ peerId, iceCandidate }) {
    if (iceCandidate) {
      connections.current[peerId].addIceCandidate(iceCandidate)
    }
  }

  //handle new remote sdp
  const setRemoteMedia = async ({
    peerId,
    sessionDescription: remoteSessionDescription,
  }) => {
    await connections.current[peerId].setRemoteDescription(
      new RTCSessionDescription(remoteSessionDescription)
    )

    //if sdp is offer create answer
    if (remoteSessionDescription.type === "offer") {
      const connection = connections.current[peerId]

      const answer = await connection.createAnswer()
      connection.setLocalDescription(answer)

      socketRef.current.emit(Actions.RELAY_SDP, {
        peerId,
        sessionDescription: answer,
      })
    }
  }

  //handle remove peer
  const handleRemovePeer = async ({ peerId, userId }) => {
    if (connections.current[peerId]) connections.current[peerId].close()
    delete connections.current[peerId]
    delete audioElements.current[peerId]
    setClients((list) => list.filter((client) => client.id !== userId))
  }

  //?capture audio
  useEffect(() => {
    let tmp = connections.current
    let tmp2 = audioElements.current

    const initChat = async () => {
      //?Socket connection is made to server
      socketRef.current = socketInit()
      await captureMedia()
      addNewClient({ muted: false, ...user }, () => {
        const localElement = audioElements.current[user.id]
        // mute your audio for yourself
        if (localElement) {
          localElement.volume = 0
          localElement.srcObject = localMediaStream.current
        }

        //?socket emit sends your audio to other users
        socketRef.current.emit(Actions.JOIN, { roomId, user })
      })
      //?socket listen from server
      const handleNewPeer = async ({
        peerId,
        createOffer,
        user: remoteUser,
      }) => {
        //?if already connected give warning
        if (peerId in connections.current) {
          return console.warn("peer already exists", user.name)
        }

        //?create peer connection
        connections.current[peerId] = new RTCPeerConnection({
          iceServers: freeice(),
        })

        //?handle new ice candidates
        connections.current[peerId].onicecandidate = (event) => {
          socketRef.current.emit(Actions.RELAY_ICE, {
            peerId,
            iceCandidate: event.candidate,
          })
        }

        // Handle on track event on this connection
        connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
          addNewClient({ ...remoteUser, muted: false }, () => {
            if (audioElements.current[remoteUser.id]) {
              audioElements.current[remoteUser.id].srcObject = remoteStream
            } else {
              let settled = false
              const interval = setInterval(() => {
                if (audioElements.current[remoteUser.id]) {
                  audioElements.current[remoteUser.id].srcObject = remoteStream
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
          socketRef.current.emit(Actions.RELAY_SDP, {
            peerId,
            sessionDescription: offer,
          })
        }
      }

      //set mute/unmute
      const setMute = (mute, userId) => {
        const clientIdx = clientsRef.current
          .map((client) => client.id)
          .indexOf(userId)
        const connectedClients = JSON.parse(JSON.stringify(clientsRef.current))
        if (clientIdx > -1) {
          connectedClients[clientIdx].muted = mute
          setClients((connectedClients) => connectedClients)
        }
      }

      socketRef.current.on(Actions.ADD_PEER, handleNewPeer)
      socketRef.current.on(Actions.REMOVE_PEER, handleRemovePeer)
      socketRef.current.on(Actions.ICE_CANDIDATE, handleIceCandidate)
      socketRef.current.on(Actions.SESSION_DESCRIPTION, setRemoteMedia)
      socketRef.current.on(Actions.MUTE, ({ peerId, userId }) => {
        console.log("mute responsee")
        setMute(true, userId)
      })

      socketRef.current.on(Actions.UNMUTE, ({ peerId, userId }) => {
        console.log("unmute responsee")
        setMute(false, userId)
      })

      socketRef.current.emit(Actions.JOIN, { roomId, user })
      //?Capture audio
      async function captureMedia() {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
      }
    }

    initChat()
    return () => {
      localMediaStream.current.getTracks().forEach((track) => track.stop())
      socketRef.current.emit(Actions.LEAVE)
      for (let peerId in tmp) {
        tmp[peerId].close()
        delete tmp2[peerId]
        delete tmp[peerId]
      }
      socketRef.current.off(Actions.ADD_PEER)
      socketRef.current.off(Actions.REMOVE_PEER)
      socketRef.current.off(Actions.ICE_CANDIDATE)
      socketRef.current.off(Actions.SESSION_DESCRIPTION)
      socketRef.current.off(Actions.MUTE)
      socketRef.current.off(Actions.UNMUTE)
    }
  }, [])

  //handle Mute
  const handleMute = (isMute, userId) => {
    let settled = false
    if (userId === user._id) {
      const interval = setInterval(() => {
        if (localMediaStream.current) {
          console.log(localMediaStream.current.getTracks())
          localMediaStream.current.getTracks()[0].enabled = !isMute
          if (isMute) {
            socketRef.current.emit(Actions.MUTE, {
              roomId,
              userId: user._id,
            })
          } else {
            socketRef.current.emit(Actions.UNMUTE, {
              roomId,
              userId: user._id,
            })
          }
          settled = true
        }
        if (settled) {
          clearInterval(interval)
        }
      }, 300)
    }
  }

  //provide ref provides audio element map
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance
  }

  return {
    clients,
    provideRef,
    handleMute,
  }
}
