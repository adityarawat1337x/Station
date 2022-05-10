require("dotenv").config()
const express = require("express")
const app = express()
const router = require("./routes")
const cors = require("cors")
const DBConnect = require("./DATABASE")
const cookieParser = require("cookie-parser")
const Actions = require("./actions")
const server = require("http").createServer(app)

const io = require("socket.io")(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
  },
})

const corsOptions = {
  credentials: true,
  origin: [process.env.CLIENT_URL],
}

const port = process.env.PORT || 5000

DBConnect()
app.use(cookieParser())
app.use(cors(corsOptions))
app.use("/storage", express.static("storage"))
app.use(express.json({ limit: "8mb" }))
app.use(router)

app.get("/", (req, res) => {
  res.send(process.env.CLIENT_URL + " is sending request")
})

//?sockets
let socketUserMap = {}

io.on("connection", (socket) => {
  //?User joins room so add to socketUserMap
  socket.on(Actions.JOIN, ({ roomId, user }) => {
    if (socketUserMap[socket.id]) return
    socketUserMap[socket.id] = user

    //?get the room of roomId
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
    console.log(socket.id, "joined", roomId)

    clients.forEach((clientId) => {
      //?sending connect request to all those clients
      io.to(clientId).emit(Actions.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      })

      //? sending yourself a request to create offer for that client
      socket.emit(Actions.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMap[clientId],
      })
    })

    //?join the room
    console.log(socket.id, " joined ", roomId)
    socket.join(roomId)
  })

  //?handle relay ice
  socket.on(Actions.RELAY_ICE, ({ peerId, iceCandidate }) => {
    io.to(peerId).emit(Actions.ICE_CANDIDATE, {
      peerId: socket.id,
      iceCandidate,
    })
  })

  //?handle sdp ice
  socket.on(Actions.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(Actions.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    })
  })

  //?handle mute/unmute
  socket.on(Actions.MUTE, ({ roomId, userId }) => {
    console.log("mute", userId, roomId)
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

    clients.forEach((clientId) => {
      io.to(clientId).emit(Actions.MUTE, {
        peerId: socket.id,
        userId,
      })
    })
  })

  socket.on(Actions.UNMUTE, ({ roomId, userId }) => {
    console.log("un-mute", userId, roomId)
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

    clients.forEach((clientId) => {
      io.to(clientId).emit(Actions.UNMUTE, {
        peerId: socket.id,
        userId,
      })
    })
  })

  //?leaving the room
  const leaveRoom = async () => {
    const { rooms } = socket
    if (socketUserMap) {
      Array.from(rooms).forEach((roomId) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

        clients.forEach((clientId) => {
          io.to(clientId).emit(Actions.REMOVE_PEER, {
            peerId: socket.id,
            userId: socketUserMap[socket.id]?._id,
          })
          socket.emit(Actions.REMOVE_PEER, {
            peerId: clientId,
            userId: socketUserMap[clientId]?._id,
          })
        })
        console.log(socket.id, " left ", roomId)
        socket.leave(roomId)
      })
      delete socketUserMap[socket.id]
    }
  }
  socket.on(Actions.LEAVE, leaveRoom)
  socket.on("disconnecting", leaveRoom)
})

server.listen(port, () => {
  console.log(`Server started at port ${port}`)
})
