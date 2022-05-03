const axios = require("axios")

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

export const sentOtp = (data) => api.post("/api/send-otp", data)
export const verifyOtp = (data) => api.post("/api/verify-otp", data)
export const activate = (data) => api.post("/api/activate", data)
export const logout = () => api.post("/api/logout")
export const createRoom = (data) => api.post("/api/rooms", data)
export const getRooms = () => api.get("/api/rooms")
export const getRoom = (roomId) => api.get(`/api/rooms/${roomId}`)

api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalReq = error.config
    if (error.response.status === 401 && originalReq && !originalReq._isRetry) {
      originalReq._isRetry = true

      try {
        const resp = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/refresh`,
          {
            withCredentials: true,
          }
        )

        return api.request(originalReq)
      } catch (err) {
        console.log(err.message)
      }
    } else throw error
  }
)

export default api
