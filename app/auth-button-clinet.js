"use client"

import { Button } from "@mui/material"
import { createClient } from "../utils/supabase/client"
import { useRouter } from "next/navigation"
import React from "react"

export default function AuthButtonClinet({ session }) {
  const router = useRouter()
  const supabase = createClient()

  async function handelSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    })
  }

  async function handelSignOut() {
    await supabase.auth.signOut()
    router.refresh() // Refresh the page to log out
  }

  console.log("session", session)

  return session ? (
    <Button
      onClick={handelSignOut}
      variant="contained"
      href="/signup"
      sx={{
        backgroundColor: "black",
        color: "white",
        textTransform: "none",
        "&:hover": { backgroundColor: "#444" },
      }}
    >
      SignOut
    </Button>
  ) : (
    <Button
      onClick={handelSignIn}
      variant="outlined"
      href="/login"
      sx={{
        borderColor: "black",
        color: "black",
        textTransform: "none",
        "&:hover": { backgroundColor: "black", color: "white" },
      }}
    >
      Login
    </Button>
  )
}
