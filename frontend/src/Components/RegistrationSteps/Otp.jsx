import React from "react"
import LoginCard from "../Shared/LoginCard"
import { Input, VStack, Text, Spacer } from "@chakra-ui/react"

const Otp = (props) => {
  const { next } = props
  return (
    <LoginCard
      title="Enter OTP"
      data={
        <VStack>
          <Spacer />
          <Input variant="filled" width="-moz-fit-content" />
          <Spacer />
          <Text fontSize="sm" colorScheme="gray">
            We have sent you an otp for verification.
          </Text>
        </VStack>
      }
      btnText="Next 🡪"
      btnHandler={() => {
        next((prev) => prev + 1)
      }}
    />
  )
}

export default Otp
