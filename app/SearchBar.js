import React from "react"

import serchicon from "../assets/serchicon.svg"
import burgericon from "../assets/burger.svg"
import BarndLogo from "../assets/brandlogo.jpg"
import notification from "../assets/notification.svg"
import Image from "next/image"
export default function SearchBar() {
  return (
    <div className="flex justify-between items-center h-full w-full">
      <Image src={BarndLogo} alt="BarndLogo" width={140} />
      <div className="flex gap-4">
        <div className="bg-[#fef7ff] rounded-2xl flex h-12  justify-between">
          <div className="  flex justify-center w-12  h-full">
            <Image alt="" src={burgericon} />
          </div>
          <div className=" bg-inherit   flex-1 h-full ">
            <input
              className=" outline-none w-full bg-inherit h-full"
              type="text"
              placeholder="hinted serch bar"
            />
          </div>
          <div className=" flex justify-center w-12  h-full ">
            <Image alt="" src={serchicon} />
          </div>
        </div>
        <div className="bg-red-400 h-12 flex items-center justify-center p-2 rounded-xl">
          <p className="text-white">Post Property</p>
        </div>

        <Image src={notification} alt="" />
      </div>
    </div>
  )
}
