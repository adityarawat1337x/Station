import { useState } from "react"
import LoginCard from "../../Shared/LoginCard"
import { Input, VStack, Text, Spacer } from "@chakra-ui/react"
import { sentOtp } from "../../../http"
import { useDispatch } from "react-redux"
import { setOtp } from "../../../store/authSlice"

const Phone = (props) => {
  const { next } = props
  const [phone, setPhone] = useState("")
  const dispatch = useDispatch()

  async function submit() {
    const res = await sentOtp({ phone: phone })
    console.log(res)
    dispatch(setOtp(res.data))
    next((prev) => prev + 1)
  }

  console.log(phone)
  return (
    <LoginCard
      title="📞 Enter Phone"
      data={
        <VStack>
          <Spacer />
          <Input
            onChange={(e) => setPhone(e.target.value)}
            variant="filled"
            width="-moz-fit-content"
          />
          <Spacer />
          <Text fontSize="sm" colorScheme="gray">
            We will send you an otp to verify your phone.
          </Text>
          <Text fontSize="sm" colorScheme="gray">
            By Entering your email, you agree to our Terms of Service and
            Privacy Policy.
          </Text>
          <Spacer />
        </VStack>
      }
      btnText="Next 🡪"
      btnHandler={() => {
        submit()
      }}
    />
  )
}

export default Phone
