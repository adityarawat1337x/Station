require("dotenv").config()

const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const router = require("./routes")
const cors = require("cors")
const DBConnect = require("./DATABASE")
const cookieParser = require("cookie-parser")

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

app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})
