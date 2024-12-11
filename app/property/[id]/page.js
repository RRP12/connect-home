import { createClient } from "../../../utils/supabase/server"

export default async function PropertyPage({ params }) {
  const { id: propertyID } = params
  const supabase = await createClient()
  let { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyID)

  if (error) {
    throw error
  }

  let [data] = property

  // You can fetch and display the property here based on the `id`
  return (
    // <>
    //   title : {property[0].title}
    //   <div>Property ID : {propertyID}</div>
    // </>

    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">{data.property_title}</h1>
      <p className="text-gray-600 mb-2">{data.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Property Details</h2>
          <ul className="list-disc pl-5">
            <li>Type: {data.property_type}</li>
            <li>Address: {data.address}</li>
            <li>Area: {data.area}</li>
            <li>Pincode: {data.pincode}</li>
            <li>City: {data.city}</li>
            <li>State: {data.state}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Price Details</h2>
          <ul className="list-disc pl-5">
            <li>Daily: ₹{data.price_for_sharing?.daily}</li>
            <li>Weekly: ₹{data.price_for_sharing?.weekly}</li>
            <li>Base Price: ₹{data.price}</li>
          </ul>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Amenities</h2>

        {JSON.stringify(data?.amenities)}
        {/* <ul className="flex space-x-4">
          {data?.amenities.map((amenity, index) => (
            <li
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
            >
              {amenity}
            </li>
          ))}
        </ul> */}
      </div>

      <div>
        <h2 className="text-lg font-semibold">Other Details</h2>
        <ul className="list-disc pl-5">
          <li>Identity Proof: {data.identity_proof}</li>
          <li>User ID: {data.user_id}</li>
          <li>Created At: {new Date(data.created_at).toLocaleString()}</li>
          <li>Updated At: {new Date(data.updated_at).toLocaleString()}</li>
        </ul>
      </div>
    </div>
  )
}
