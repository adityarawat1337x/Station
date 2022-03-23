import React from "react"
import { TabList, Tab, Tabs, TabPanels, TabPanel } from "@chakra-ui/react"
import Phone from "./Phone"
import Email from "./Email"
import { BsFillPhoneFill } from "react-icons/bs"

import { IoMdMail } from "react-icons/io"
const PhoneEmail = (props) => {
  const { next } = props

  return (
    <>
      <Tabs align="end" variant="soft-rounded">
        <TabList>
          <Tab>
            <BsFillPhoneFill />
          </Tab>
          <Tab>
            <IoMdMail />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Phone next={next} />
          </TabPanel>
          <TabPanel>
            <Email next={next} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

export default PhoneEmail
