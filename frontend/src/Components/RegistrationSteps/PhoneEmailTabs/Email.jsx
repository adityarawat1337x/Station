import React from "react"
import LoginCard from "../../Shared/LoginCard"
import { Input, Spacer, Text, VStack } from "@chakra-ui/react"

const Email = (props) => {
  const { next } = props
  return (
    <LoginCard
      title="✉️ Enter Email"
      data={
        <>
          <VStack>
            <Spacer />
            <Input autoFocus variant="filled" width="-moz-fit-content" />
            <Spacer />
            <Text fontSize="sm" colorScheme="gray">
              We will send you an otp to verify your email.
            </Text>

            <Spacer />
          </VStack>
        </>
      }
      btnText="Next 🡪"
      btnHandler={() => {
        next((prev) => prev + 1)
      }}
    />
  )
}

export default Email
