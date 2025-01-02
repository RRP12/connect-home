"use client"

export default function PropertyList({ properties }) {
  // console.log("properties", properties)
  // Address
  // :
  // "123, Andheri West, Mumbai, Maharashtra"
  // Area
  // :
  // "Andheri West"
  // Location
  // :
  // "0101000020E610000067D5E76A2B36524052499D8026223340"
  // Property Name
  // :
  // "Rushikesh PG"
  return (
    <div>
      {properties.map((p) => (
        <>
          <p>{p["Property Name"]}</p>
        </>
      ))}
    </div>
  )
}
