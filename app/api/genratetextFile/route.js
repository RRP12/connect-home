import fs from "fs"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(req, Response) {
  return new Response("Hello World", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
