"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { LocationInput } from "./LocationInput";

export default function LocationSelector({ setAddress }) {
  const [streetadress, setstreetadress] = useState("");
  useEffect(() => {
    async function getLocation() {
      if ("geolocation" in navigator) {
        // Prompt user for permission to access their location
        navigator.geolocation.getCurrentPosition(
          // Success callback function
          async (position) => {
            // Get the user's latitude and longitude coordinates
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            // Call LocationIQ API for reverse geocoding

            fetch(
              `https://us1.locationiq.com/v1/reverse?key=pk.1f9c41d0bd69b268097b057cd9345bfd&lat=${lat}&lon=${lng}&format=json&`
            )
              .then((res) => res.json())
              .then((res) => setstreetadress(res.display_name))
              .catch((err) => console.error(err));
            // Optionally: Do something with the location data (e.g., update state or display on a map)
          },
          // Error callback function
          (error) => {
            // Handle errors, e.g., user denied location sharing permissions
            console.error("Error getting user location:", error);
          }
        );
      } else {
        // Geolocation is not supported by the browser
        console.error("Geolocation is not supported by this browser.");
      }
    }

    // Call the getLocation function on component mount
    getLocation();
  }, []);

  function handelClick() {
    setAddress(streetadress);
  }
  return (
    <main>
      <LocationContainer onClick={handelClick}>
        <LocationInput />
      </LocationContainer>
    </main>
  );
}

const LocationContainer = styled.section`
  border-radius: 2px;
  background-color: #fff;
  display: flex;
  gap: 13px;
  overflow: hidden;
  color: var(--sds-color-text-default-default);
  padding: 4px 11px;
  font: var(--sds-typography-body-font-weight-regular)
    var(--sds-typography-body-size-medium) / 22px
    var(--sds-typography-body-font-family);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: fit-content;
`;
