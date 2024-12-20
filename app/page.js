// import styled from "styled-components"
import { createClient } from "../utils/supabase/server"
import AuthButtonServer from "./auth-button-server"
import { redirect } from "next/navigation"
import PropertyList from "../components/propertyList/PropertyList"
import { Suspense } from "react"
import { TableRowSkeleton } from "./skeletons"
import Chatbot from "./test/chatbot"
export default async function Home() {
  // const supabase = await createClient()

  // const {
  //   data: { session },
  // } = await supabase.auth?.getSession()

  // if (!session) {
  //   redirect("/login")
  // }
  return (
    <div className="border-3 border-gray-500 py-6  h-screen w-full sm:w-[90%] m-auto flex flex-row gap-4 my-4  sm:flex-col mb-7   ">
      <div className="flex gap-4 h-screen  flex-col  w-full sm:w-full sm:flex-row justify-between flex-1">
        <div className="  border rounded px-4 py-4 w-[50%]  justify-between h-[80%]  flex-col   hidden    lg:flex">
          <div className="flex flex-col">
            <p>Results for</p>
            <div className="flex gap-2 items-center align-center justify-start">
              <div className="rounded-xl bg-blue-500 w-2 h-2"></div>
              <p className="text-gray-400 font-semibold">
                <span className="rounded-xl bg-blue-500 w-5 h-5"></span>
                Kadam Wadi, Marol, Andheri East, Mumbai
              </p>
            </div>
          </div>
          <div className="mb-6">
            <h1 className=" my-4 font-extralight text-gray-600">
              AI Suggestions
            </h1>

            <div className="divide-y divide-dashed w-26 space-y-1">
              <div>
                <p className="text-gray-400">Pg in Andheri</p>
              </div>
              <p className="text-gray-400">Pg in marol</p>
              <p className="text-gray-400">Pg in bandra</p>
            </div>
          </div>
          <Chatbot />
        </div>

        <div className="overflow-auto  flex-1 w-full md:w-screen  h-[80%]  sm:h-[100%]  sm:w-[100%]  scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100 ">
          <Suspense fallback={<TableRowSkeleton />}>
            <PropertyList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
