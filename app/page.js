import styled from "styled-components"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import AuthButtonServer from "./auth-button-server"
import { redirect } from "next/navigation"
import Container from "./ui/container/container"
import PropertyList from "../components/propertyList/PropertyList"
import { CiHome, CiBellOn, CiChat1, CiUser } from "react-icons/ci"
import SearchBox from "../components/searchbox/searchbox"
import { lusitana } from "./ui/fonts"
import clsx from "clsx"
import { Suspense } from "react"
import { TableRowSkeleton } from "./skeletons"

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  let user = await supabase.auth.getUser()

  return (
    <>
      <div className="md:hidden">
        <SearchBox />
      </div>
      <Container>
        <div
          style={{
            overflow: "auto",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Suspense fallback={<TableRowSkeleton />}>
            <PropertyList />
          </Suspense>
        </div>

        <Aside />
      </Container>
    </>
  )
}

const Aside = () => {
  const data = [
    { name: "Explore", icon: CiHome, status: "pending" },
    { name: "Notification", icon: CiBellOn, status: "pending" },
    { name: "Messages", icon: CiChat1, status: "pending" },
    { name: "Profile", icon: CiUser, status: "pending" },
  ]

  return (
    <div className="hidden md:flex my-4 flex flex-col gap-10 ">
      {/* <AuthButtonServer /> */}
      <SearchBox />
      {data.map(({ name, icon: Icon, status }) => (
        <div key={name} className="flex gap-3 items-center">
          <Icon className="font-semibold size-5" />
          <h1
            className={clsx(
              "inline-flex items-center rounded-full px-2 py-1 text-sm",
              {
                "bg-gray-100 text-gray-500": status === "pending",
                "bg-green-500 text-white": status === "paid",
              }
            )}
          >
            {name}
          </h1>
        </div>
      ))}
    </div>
  )
}
