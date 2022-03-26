require("dotenv").config()

const express = require("express")
const app = express()
const port = process.env.PORT || 5000
const router = require("./routes")
const cors = require("cors")
const DBConnect = require("./DATABASE")

const corsOptions = {
  credentials: true,
  optionSuccessStatus: 200,
  "Access-Control-Allow-Origin": "*",
}

DBConnect()
app.use(cors(corsOptions))
app.use(express.json())
app.use(router)

app.get("/", (req, res) => {
  res.send("hello from server")
})

app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})
