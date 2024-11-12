"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie"; // Using js-cookie instead of next/headers
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Alert } from "@mui/material"; // Import MUI Alert

import { Controller } from "react-hook-form";
const BasicDetails = ({ handleSubmit, register, errors, reset, control }) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To display errors like duplicate key

  const supabase = createClientComponentClient({ cookies: Cookies.get() });

  // Handle form submission
  const handleFormSubmit = async (data) => {
    try {
      // Insert data into the properties table
      const { error } = await supabase.from("properties").insert([
        {
          title: data.propertyTitle,
          location:
            data.location || `${location.latitude}, ${location.longitude}`,
          landmark: data.landmark,
          pincode: data.pincode,
          property_type: data.propertyType,
        },
      ]);

      if (error) {
        // Check if the error is a duplicate key violation
        if (error.code === "23505") {
          setErrorMessage(
            "The property title already exists. Please choose a different title."
          );
        } else {
          setErrorMessage("An error occurred while submitting your form.");
        }
        throw error; // Stop further execution if error occurred
      }

      // Reset form and states if submission is successful
      reset(); // Reset form fields
      setLocation({ latitude: null, longitude: null });
      setStatus("");
      setErrorMessage(""); // Clear error message
      alert("Property details added successfully!");
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  // Geolocation logic
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
      return;
    }

    setStatus("Locating…");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setStatus("");
      },
      () => {
        setStatus("Unable to retrieve your location");
      }
    );
  }, []);

  return (
    <form
      className="max-w-sm mx-auto"
      onSubmit={handleSubmit(handleFormSubmit)} // Submit handler
    >
      {/* Show error message using MUI Alert */}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <p>{status}</p>
      {location.latitude && location.longitude && (
        <p>
          Latitude: {location.latitude} °, Longitude: {location.longitude} °
        </p>
      )}
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Enter your property name
        </label>
        <input
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
          {...register("propertyTitle", { required: "Required" })}
          placeholder="Write your name here"
        />
        {errors.propertyTitle && <p>{errors.propertyTitle.message}</p>}
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Enter your property location
        </label>
        <input
          placeholder={
            location
              ? `${location.latitude}, ${location.longitude}`
              : "Enter your location"
          }
          {...register("location", { required: "Required" })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          type="text"
        />
        {errors.location && <p>{errors.location.message}</p>}
        <button type="button">
          Current location
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-6 w-6 text-blue-500"
          >
            <path
              fill="currentColor"
              d="M12 2C8.13 2 5 5.13 5 9c0 2.76 2.25 5.54 5.45 9.24L12 21l1.55-2.76C16.75 14.54 19 11.76 19 9c0-3.87-3.13-7-7-7zm0 9c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"
            />
          </svg>
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Enter Landmark
          </label>
          <input
            {...register("landmark")}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Enter pincode
          </label>
          <input
            {...register("pincode", {
              required: "Required",
              pattern: {
                value: /^\d{6}$/,
                message: "Invalid Pincode (6 digits required)",
              },
            })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Select an option
        </label>
        <select
          {...register("propertyType", {
            required: "Please select a property type",
          })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Choose a Property Type</option>
          <option value="PG">PG (paying guest)</option>
          <option value="Sharing Flats">Sharing Flats</option>
        </select>
        {errors.propertyType && <p>{errors.propertyType.message}</p>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default BasicDetails;
