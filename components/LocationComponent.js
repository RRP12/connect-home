"use client"

import { useEffect, useState } from "react"
import MyLocationIcon from "@mui/icons-material/MyLocation"
export default function GetLocationComponent() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [propertyName, setPropertyName] = useState("") // Example property name

  useEffect(() => {
    // Check if geolocation is available in the browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position?.coords.latitude
          const longitude = position?.coords.longitude

          const options = {
            method: "GET",
            headers: { accept: "application/json" },
          }

          fetch(
            `https://us1.locationiq.com/v1/reverse?key=pk.1f9c41d0bd69b268097b057cd9345bfd&lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            options
          )
            .then((res) => res.json())
            .then((res) => {
              const address = res.address
              // Combine the fetched address with the property name
              const fullAddress = `${propertyName}, ${address.road || ""}, ${
                address.suburb || ""
              }, ${address.city || ""}, ${address.state || ""}, ${
                address.country || ""
              }`
              setLocation(fullAddress) // Update state with the full address
            })
            .catch((err) => setError("Error: " + err.message))
        },
        (err) => {
          setError("Geolocation error: " + err.message) // Handle geolocation error
        }
      )
    } else {
      setError("Geolocation is not supported by this browser.")
    }
  }, [propertyName])

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : location ? (
        <p>
          <MyLocationIcon />
          <span> Your location</span>: {location}
        </p>
      ) : (
        <p>Getting location...</p>
      )}
    </div>
  )
}
