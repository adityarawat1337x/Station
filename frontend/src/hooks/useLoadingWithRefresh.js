import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setAvatar, setName } from "../store/activateSlice"
import { setAuth } from "../store/authSlice"

export function useLoadingWithRefresh() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/refresh`,
          {
            withCredentials: true,
          }
        )
        dispatch(setAuth(data))
        dispatch(setName(data.user.name))
        dispatch(setAvatar(data.user.avatar))
        setLoading(false)
      } catch (err) {
        console.log(err)
        setLoading(false)
      }
    }
    check()
  }, [dispatch])

  return loading
}
