import { Container } from "@chakra-ui/react"
import { React, useState } from "react"
import styled from "styled-components"
import PhoneEmail from "../Components/RegistrationSteps/PhoneEmailTabs/PhoneEmail"
import Otp from "../Components/RegistrationSteps/Otp"

const steps = {
  1: PhoneEmail,
  2: Otp,
}

const Authenticate = () => {
  const [state, setstate] = useState(1)

  const Component = steps[state]

  return (
    <Frame>
      <Component next={setstate} />
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

export default Authenticate
