import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";
import AuthButtonClinet from "./auth-button-clinet";
export default async function AuthButtonServer() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return <AuthButtonClinet session={session} />;
}
