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
    <div className="border-3 border-gray-500 h-screen w-full m-auto flex flex-col gap-4 my-4 mb-7">
      <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
        {/* Hide Chatbot on mobile, show on lg+ */}
        <div className="hidden lg:flex flex-1 min-h-0 max-h-[80vh]">
          <Chatbot />
        </div>
        <div className="flex-1 min-h-0 overflow-auto scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <Suspense fallback={<TableRowSkeleton />}>
            <PropertyList maxProperties={10} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
