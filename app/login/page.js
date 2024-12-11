import { createClient } from "../../utils/supabase/server"
import { redirect } from "next/navigation"

import AuthButtonClinet from "../auth-button-clinet"
export default async function Login() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase?.auth?.getSession()

  if (session) {
    redirect("/")
  }

  return <AuthButtonClinet session={session} />
}
