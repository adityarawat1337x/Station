import { Container } from "@chakra-ui/react"
import React, { useState } from "react"
import styled from "styled-components"
import Name from "../Components/RegistrationSteps/Name"
import Avataar from "../Components/RegistrationSteps/Avatar"

const steps = {
  1: Name,
  2: Avataar,
}

const Activate = () => {
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
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default Activate
