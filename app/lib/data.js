import { createClient } from "../../utils/supabase/server"

export async function fetchUsersPropetiesbyId(userId) {
  let supabase = createClient()
  if (userId) {
    try {
      let { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", userId)

      if (error) {
        throw new Error("Failed to fetch revenue data.")
      }
      return data
    } catch (error) {
      console.error("Database Error:", error)
      throw new Error("Failed to fetch revenue data.")
    }
  }
}

export async function fetchUsersPropeties() {
  try {
    let { data, error } = await supabase.from("properties").select("*")

    if (error) {
      console.error("Database Error:", error)
      throw new Error("Failed to fetch revenue data.")
    }
    return data
  } catch (error) {
    console.error("Database Error:", error)
    throw new Error("Failed to fetch revenue data.")
  }
}
