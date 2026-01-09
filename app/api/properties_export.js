// app/api/properties/route.js
import { createClient } from "../../../utils/supabase/server" // Adjust the path to your Supabase utility file

export async function GET() {
  let supabase = await createClient()
  // Fetch data from Supabase
  const { data, error } = await supabase
    .from("properties") // Replace with your table name
    .select("*") // Fetch all columns

  // Handle errors
  if (error) {
    return new Response("Error fetching data", { status: 500 })
  }

  // Format data into plain text
  const formattedText = data
    .map((property, index) => {
      return `Property ${index + 1}:
Property Name: ${property.property_title || "N/A"}
Address: ${property.address || "N/A"}
Location: ${property.location || "N/A"}
Area: ${property.area || "N/A"}
----------------------------------
`
    })
    .join("\n") // Join all properties into one string

  // Return the text as a downloadable file
  return new Response(formattedText, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": "attachment; filename=properties.txt",
    },
  })
}
