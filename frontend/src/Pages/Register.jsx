import { Container } from "@chakra-ui/react"
import { React, useState } from "react"
import styled from "styled-components"
import { useHistory } from "react-router-dom"
import PhoneEmail from "../Components/RegistrationSteps/PhoneEmailTabs/PhoneEmail"
import Otp from "../Components/RegistrationSteps/Otp"
import Name from "../Components/RegistrationSteps/Name"

const steps = {
  1: PhoneEmail,
  2: Otp,
  3: Name,
}
const Register = () => {
  const [state, setstate] = useState(1)

  const Component = steps[state]

  const navigate = useHistory()
  return (
    <Frame>
      <Component setstate={setstate} />
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

export default Register
