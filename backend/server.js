require("dotenv").config()

const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const router = require("./routes")
const cors = require("cors")
const DBConnect = require("./DATABASE")
const cookieParser = require("cookie-parser")
const Actions = require("./actions")
const server = require("http").createServer(app)

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
}

DBConnect()
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json({ limit: "8mb" }))
app.use("/storage", express.static("storage"))
app.use(router)

app.get("/", (req, res) => {
  res.send("hello from server")
})

//?sockets
const socketUserMap = {}
io.on("connection", (socket) => {
  console.log("New connection", socket.id)
  socket.on(Actions.JOIN, ({ roomId, user }) => {
    socketUserMap[socket.id] = user

    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
    clients.forEach((clientId) => {
      io.to(clientId).emit(Actions.ADD_PEER, {})
    })
    socket.emit(Actions.ADD_PEER, {})
    socket.join(roomId)
  })
})

server.listen(port, () => {
  console.log(`Server started at port ${port}`)
})
