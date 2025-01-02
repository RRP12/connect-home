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
    <div className="border-3 border-gray-500 flex-wrap h-screen w-[100%] m-auto flex flex-row gap-4 my-4 mb-7 justify-between">
      <Chatbot />

      <div className="overflow-auto flex-1  md:w-screen h-[80%] sm:h-[100%] sm:w-[100%] scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <Suspense fallback={<TableRowSkeleton />}>
          <PropertyList />
        </Suspense>
      </div>
    </div>
  )
}
