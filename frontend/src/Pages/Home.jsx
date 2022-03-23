import { Container } from "@chakra-ui/react"
import React from "react"
import styled from "styled-components"
import LoginCard from "../Components/Shared/LoginCard"
import { useHistory } from "react-router-dom"

const Home = () => {
  const navigate = useHistory()
  return (
    <Frame>
      <LoginCard
        title="Welcome to Codehouse"
        data=" Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sunt, deleniti.
      Quibusdam doloremque iure non nam quia voluptate, modi aspernatur fugiat
      commodi labore nisi officia aliquam ipsam inventore perferendis dolore
      accusamus eos sunt velit vero tempore officiis id cupiditate eaque.
      Similique?"
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
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default Home
