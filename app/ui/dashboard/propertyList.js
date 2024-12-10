import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { fetchUsersPropetiesbyId } from "../../lib/data"
import { cookies } from "next/headers"
import PropertyCard from "./property-card"
export default async function RevenueChart({ userId }) {
  const properties = await fetchUsersPropetiesbyId(userId)
  return <PropertyCards properties={properties} />
}
let supabase = createServerComponentClient({ cookies })
async function handelClick(property_id) {
  "use server"
  const { data, error } = await supabase
    .from("properties")
    .update({ property_title: "salm hayak" })
    .eq("id", property_id)
    .select()
}

const PropertyCards = ({ properties }) => {
  return (
    <div className="flex flex-row flex-wrap border border-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {properties?.map((property) => (
          <PropertyCard key={property?.id} property={property} />
        ))}
      </div>
    </div>
  )
}
