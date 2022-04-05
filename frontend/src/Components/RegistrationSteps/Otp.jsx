import React, { useState } from "react"
import LoginCard from "../Shared/LoginCard"
import { Input, VStack, Text, Spacer } from "@chakra-ui/react"
import { useSelector, useDispatch } from "react-redux"
import { verifyOtp } from "../../http"
import { setAuth } from "../../store/authSlice"
import { setAvatar, setName } from "../../store/activateSlice"

const Otp = (props) => {
  const { next } = props
  const [otp, setotp] = useState("")

  const { hash, phone } = useSelector((state) => state.auth.otp)
  const dispatch = useDispatch()

  const Submit = async () => {
    if (!otp || !hash || !phone) return
    try {
      const res = await verifyOtp({ otp: otp, hash: hash, phone: phone })
      console.log(res)
      dispatch(setAuth(res.data))
      dispatch(setName(res.data.user.name))
      dispatch(setAvatar(res.data.user.avatar))
    } catch (err) {
      alert("Invalid Otp")
    }
  }

  console.log(otp)
  return (
    <LoginCard
      title="Enter OTP"
      data={
        <VStack>
          <Spacer />
          <Input
            autoFocus
            onChange={(e) => {
              setotp(e.target.value)
            }}
            variant="filled"
            width="-moz-fit-content"
          />
          <Spacer />
          <Text fontSize="sm" colorScheme="gray">
            We have sent you an otp for verification.
          </Text>
        </VStack>
      }
      btnText="Next 🡪"
      btnHandler={() => {
        Submit()
      }}
    />
  )
}

export default Otp
