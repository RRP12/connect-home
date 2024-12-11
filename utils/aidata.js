"use server"

import { createClient } from "../utils/supabase/client"

let supabase = createClient()

async function getdata() {
  let { data: properties, error } = await supabase
    .from("properties")
    .select("*")

  return properties
}
s
function formatPropertyContent(propertyData) {
  // Extract fields from the property data
  const propertyTitle = propertyData.property_title || "No title provided"
  const address = propertyData.address || "Not provided"
  const area = propertyData.area || "Not provided"
  const city = propertyData.city || "Not provided"
  const state = propertyData.state || "Not provided"
  const price = propertyData.price || "Not provided"
  const description = propertyData.description || "No description provided"
  const amenities = Array.isArray(propertyData.amenities)
    ? propertyData.amenities.join(", ")
    : propertyData.amenities || "Not provided"

  // Combine all the extracted fields into a single string
  const content =
    `Property Title: ${propertyTitle}\n` +
    `Address: ${address}\n` +
    `Area: ${area}\n` +
    `City: ${city}\n` +
    `State: ${state}\n` +
    `Price: ₹${price}\n` +
    `Amenities: ${amenities}\n` +
    `Description: ${description}`

  return content
}

let properties = await getdata()
let formatedData = []
if (properties) {
  formatedData = properties?.map((p) => {
    let formattedContent = formatPropertyContent(p)
    return formattedContent
  })
} else {
  console.log("no data")
}

export { formatedData }
