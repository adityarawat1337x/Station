import React from "react"
import LoginCard from "../Shared/LoginCard"

const Username = (props) => {
  const { setstate } = props
  return (
    <LoginCard
      title="Choose a Username"
      data=" Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sunt, deleniti.
  Quibusdam doloremque iure non nam quia voluptate, modi aspernatur fugiat
  commodi labore nisi officia aliquam ipsam inventore perferendis dolore
  accusamus eos sunt velit vero tempore officiis id cupiditate eaque.
  Similique?"
      btnText="Next 🡪"
      btnHandler={() => {
        setstate((prev) => prev + 1)
      }}
    />
  )
}

export default Username
