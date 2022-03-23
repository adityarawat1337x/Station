import React from "react"
import LoginCard from "../../Shared/LoginCard"
import { Input, VStack, Text, Spacer } from "@chakra-ui/react"
import sentOtp from "../../../http"

const Phone = (props) => {
  const { next } = props

  const submit = (e) => {
    e.preventDefault()
    sentOtp(e.target.phone.value)
    next((prev) => prev + 1)
  }

  return (
    <LoginCard
      title="📞 Enter Phone"
      data={
        <VStack>
          <Spacer />
          <Input variant="filled" width="-moz-fit-content" />
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
