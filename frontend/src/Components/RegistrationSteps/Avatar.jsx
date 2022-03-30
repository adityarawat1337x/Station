import { Avatar, Input } from "@chakra-ui/react"
import React, { useState } from "react"
import LoginCard from "../Shared/LoginCard"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"
import { setAvatar } from "../../store/activateSlice"
import { activate } from "../../http"
import { setAuth } from "../../store/authSlice"

const Avataar = (props) => {
  const { next } = props

  const { name, avatar } = useSelector((state) => state.activate)

  const [image, setImage] = useState(require("../../assets/guest.jpeg"))

  const dispatch = useDispatch()

  const captureImage = (e) => {
    const img = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(img)
    reader.onloadend = (e) => {
      setImage(reader.result)
      dispatch(setAvatar(reader.result))
    }
  }

  const Submit = async () => {
    try {
      const data = await activate({ name: name, avatar: avatar })
      console.log(data.data)
      if (data.data && data.data.auth) {
        dispatch(setAuth(data.data))
        next((prev) => prev + 1)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <LoginCard
      title={`Hello, ${name}!`}
      data={
        <>
          <Avatar
            name="image"
            border={"4px solid gray"}
            size="xl"
            src={image}
          />
          <Input
            onChange={(e) => captureImage(e)}
            id="photo"
            hidden={true}
            type="file"
          />
          <Label htmlFor="photo">Choose a profile Image</Label>
        </>
      }
      btnText="Next 🡪"
      btnHandler={() => {
        Submit()
      }}
    />
  )
}

const Label = styled.label`
  text-decoration: underline;
`

export default Avataar
