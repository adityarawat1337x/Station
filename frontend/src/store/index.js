import { configureStore } from "@reduxjs/toolkit"
import auth from "./authSlice"
import activate from "./activateSlice"
const store = configureStore({
  reducer: { auth, activate },
})

export default store
