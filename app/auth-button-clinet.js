"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthButtonClinet({ session }) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  async function handelSignIn() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  }

  async function handelSignOut() {
    await supabase.auth.signOut();
    router.refresh(); // Refresh the page to log out
  }

  return session ? (
    <button onClick={handelSignOut}>logout</button>
  ) : (
    <button onClick={handelSignIn}>login</button>
  );
}
