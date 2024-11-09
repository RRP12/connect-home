"use client";

import { useEffect, useState } from "react";

export default function LocationComponent() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [formattedAddress, setFormattedAddress] = useState(""); // Store formatted address
  const [error, setError] = useState(null);

  // Get the user's current geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch location data from Geoapify
  useEffect(() => {
    if (location.latitude && location.longitude) {
      const getLocationData = async () => {
        const requestOptions = {
          method: "GET",
        };

        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${location.latitude}&lon=${location.longitude}&apiKey=b66a5b1bb17f4410bb2bfe2c40e69fb8`,
            requestOptions
          );
          const data = await response.json();

          // Check if the API returned results
          if (data.features && data.features.length > 0) {
            const address = data.features[0].properties;
            // Format the address
            setFormattedAddress(
              `${address.street || ""}, ${address.suburb || ""}, ${
                address.city || ""
              }, ${address.state || ""}`
            );
          } else {
            setFormattedAddress("Address not found.");
          }
        } catch (error) {
          setError("Error fetching location data.");
          console.error("Error:", error);
        }
      };

      getLocationData();
    }
  }, [location]);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>
          {formattedAddress
            ? `Location: ${formattedAddress}`
            : "Getting location..."}
        </p>
      )}
    </div>
  );
}
