import React from "react"

import serchicon from "../assets/serchicon.svg"
import burgericon from "../assets/burger.svg"
import Image from "next/image"
export default function SearchBar() {
  return (
    <div className="flex justify-between items-center h-12 gap-0">
      <div className="bg-[#fef7ff] rounded-2xl flex h-12 flex-1">
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
    </div>
  )
}
