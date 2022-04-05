import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isAuth: false,
  user: null,
  otp: {
    phone: "",
    hash: "",
  },
}

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user
      if (action.payload.user) state.isAuth = true
      else state.isAuth = false
    },
    setOtp: (state, action) => {
      state.otp.phone = action.payload.phone
      state.otp.hash = action.payload.hash
    },
  },
})

export const { setAuth } = userSlice.actions
export const { setOtp } = userSlice.actions
export default userSlice.reducer
