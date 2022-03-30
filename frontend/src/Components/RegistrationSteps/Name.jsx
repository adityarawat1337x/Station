import { Input } from "@chakra-ui/react"
import React, { useState } from "react"
import LoginCard from "../Shared/LoginCard"
import { useDispatch, useSelector } from "react-redux"
import { setName } from "../../store/activateSlice"

const Name = (props) => {
  const { next } = props

  const stateName = useSelector((state) => state.activate.name)
  console.log(stateName)
  const [name, setFullName] = useState(stateName)
  const dispatch = useDispatch()

  const submit = () => {
    if (!name) return

    dispatch(setName(name))
    next((prev) => prev + 1)
  }

  return (
    <LoginCard
      title="What's your full name?"
      data={
        <Input
          value={name}
          autoFocus
          onChange={(e) => setFullName(e.target.value)}
          variant="filled"
          width="-moz-fit-content"
        />
      }
      btnText="Next 🡪"
      btnHandler={() => {
        submit()
      }}
    />
  )
}

export default Name
