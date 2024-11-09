import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import AuthButtonClinet from "../auth-button-clinet";
export default async function Login() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/");
  }

  return <AuthButtonClinet session={session} />;
}
