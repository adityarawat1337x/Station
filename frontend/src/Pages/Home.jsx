import { Container, Text } from "@chakra-ui/react"
import React from "react"
import styled from "styled-components"
import LoginCard from "../Components/Shared/LoginCard"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"

const Home = () => {
  const navigate = useHistory()
  const user = useSelector((state) => state.auth.user)
  if (user) navigate.push("/rooms")

  return (
    <Frame>
      <LoginCard
        title="Welcome to Codehouse"
        data={
          <Text fontSize="sm" colorScheme="gray">
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sunt,
            deleniti. dolore accusamus eos sunt velit vero tempore officiis id
            cupiditate eaque. Similique?"
          </Text>
        }
        btnText="Lets Go 🡪"
        btnHandler={() => {
          navigate.push("/authenticate")
        }}
      />
    </Frame>
  )
}

const Frame = styled(Container)`
  width: 100vw;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default Home
