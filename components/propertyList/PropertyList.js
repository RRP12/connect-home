import PropertyCard from "../FacebookPropertyListing"
import { createClient } from "../../utils/supabase/server"
export default async function PropertyList() {
  let supabase = await createClient()
  let { data: properties } = await supabase.from("properties").select("*")

  return (
    <div className="flex flex-col gap-4 ">
      {properties &&
        properties?.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
    </div>
  )
}
