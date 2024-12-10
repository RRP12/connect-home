import { createClient } from "../utils/supabase/server.js"
import React from "react"
import { cookies } from "next/headers"
import AuthButtonClinet from "./auth-button-clinet"
export default async function AuthButtonServer() {
  const supabase = await createClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  // console.log("supabase in button", session)

  return <AuthButtonClinet session={session} />
}
