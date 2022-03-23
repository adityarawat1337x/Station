const axios = require("axios")

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

const sentOtp = (data) => api.post("/api/send-otp", data)

export default sentOtp
