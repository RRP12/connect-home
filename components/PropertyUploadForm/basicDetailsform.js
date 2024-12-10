"use client"

import React, { useEffect, useState } from "react"
import useGeolocation from "../../utils/location"
import { createClient } from "../../utils/supabase/client"
import LocationSelector from "../locationSelector/LocationSelector"

export default function PropertyListingStepperForm() {
  const [locationData, setLocationData] = useState({})
  const [loading, setLoading] = useState(true) // For loading indicator
  const [Address, setAddress] = useState("")
  const [userId, setUserId] = React.useState()

  let supabase = createClient()
  function getGeolocation() {
    return new Promise((resolve, reject) => {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }

      function success(pos) {
        const crd = pos.coords
        resolve({
          latitude: crd.latitude,
          longitude: crd.longitude,
          accuracy: crd.accuracy,
        })
      }

      function error(err) {
        reject(`ERROR(${err.code}): ${err.message}`)
      }

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, error, options)
      } else {
        reject("Geolocation is not supported by this browser.")
      }
    })
  }

  useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      } else if (error) {
        console.error("Error fetching user:", error.message)
      }
    }

    getUserId()
  }, [supabase])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getGeolocation()
        .then((data) => {
          setLocationData(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching geolocation:", err)
          setLoading(false)
        })
    }, 1000) // Debounce by 1 second

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId)
  }, []) // Only run on mount

  useEffect(() => {
    if (locationData) {
      fetch(
        `https://us1.locationiq.com/v1/reverse?key=pk.1f9c41d0bd69b268097b057cd9345bfd&lat=${locationData.latitude}&lon=${locationData.longitude}&format=json&`
      )
        .then((res) => res.json())
        .then((res) => {})
        .catch((err) => console.error("Error fetching reverse geocoding:", err))
    }
  }, [locationData]) // This runs when locationData is updated

  const validateCurrentStep = () => {
    switch (activeStep) {
      case 0: // Property Details step
        const requiredFields = [
          "title",
          "property_type",
          "address",
          "city",
          "state",
          "price",
        ]
        const missingFields = requiredFields.filter((field) => !formData[field])

        if (missingFields.length > 0) {
          // Optionally show error messages for missing fields
          alert(
            `Please fill in all required fields: ${missingFields.join(", ")}`
          )
          return false
        }
        return true

      case 1: // Images step
        if (formData.images.length === 0) {
          alert("Please upload at least one image")
          return false
        }
        return true

      default:
        return true
    }
  }

  const handleNext = () => {
    // Validate current step's data before moving to next step
    const isStepValid = validateCurrentStep()

    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  // Function to validate the current step's data

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const steps = ["Property Details", "Images"]

  const { coordinates, error } = useGeolocation()

  const [activeStep, setActiveStep] = useState(0)
  const [images, setImages] = useState([])
  const [openDialog, setOpenDialog] = useState(false)

  const [formData, setformData] = useState({
    images: [],
  })

  function handelChange(e) {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function getUserLocation() {
    let { data: properties, error } = await supabase
      .from("properties")
      .select("location")
  }
  getUserLocation()

  const handleFileChange = (event) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files)
      setformData((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...uploadedFiles].slice(0, 5), // Limit to 5 files
      }))
    }
  }

  async function handelSubmit(e) {
    e.preventDefault()

    // Array to store public URLs of uploaded images
    const uploadedImageUrls = []

    for (let i = 0; i < formData?.images?.length; i++) {
      const file = formData.images[i] // Get each file
      const uniqueName = `${Date.now()}-${file.name}` // Create a unique filename

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("property-images")
        .upload(`public/${uniqueName}`, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (error) {
        console.error(`Error uploading ${file.name}:`, error.message)
        continue // Skip this file if there's an error
      }

      // Generate public URL for the uploaded file
      const publicUrl = supabase.storage
        .from("property-images")
        .getPublicUrl(`public/${uniqueName}`).data.publicUrl

      // Add the public URL to the array
      uploadedImageUrls.push(publicUrl)
    }

    // Prepare data for insertion into the properties table
    const propertyData = {
      property_type: formData.property_type,
      property_title: formData.title,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      area: formData.area,
      pincode: formData.pincode,
      price: formData.price,
      amenities: formData.amenities,
      description: formData.description,
      location: `POINT(${locationData?.longitude} ${locationData?.latitude})`,

      // location: "POINT(-73.946823 40.807416)",
      images: uploadedImageUrls, // Store the array of image URLs
      user_id: userId,
    }

    // Insert data into the properties table
    const { error } = await supabase.from("properties").insert([
      propertyData,
      // {
      //   name: "Supa Burger",
      //   location: "POINT(-73.946823 40.807416)",
      // },
    ])

    if (error) {
      console.error("Error inserting property:", error.message)
    } else {
      throw error
    }

    setformData({
      images: [],
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      {/* <button onClick={handleGetLocation}>get location </button> */}
      <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-medium mb-6 text-center">
          List Your Property
        </h1>
        <form onSubmit={handelSubmit} className="space-y-6">
          {activeStep === 0 && (
            <div className="space-y-6">
              <label htmlFor="property Title">property Title</label>
              <input
                onChange={handelChange}
                name="title"
                type="text"
                className="block w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 transition-colors"
              />
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      onChange={handelChange}
                      type="radio"
                      value="pg"
                      name="property_type"
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">PG</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      onChange={handelChange}
                      type="radio"
                      value="rental"
                      name="property_type"
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">Rental Flats</span>
                  </label>
                </div>
              </div>

              <div className="mb-6 flex space-y-6 flex-col">
                <LocationSelector setAddress={setAddress} />
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  name="address"
                  type="text"
                  value={Address && Address}
                  onChange={handelChange}
                  className="mt-1 block w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    name="city"
                    onChange={handelChange}
                    type="text"
                    className="mt-1 block w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province
                  </label>
                  <input
                    name="state"
                    onChange={handelChange}
                    type="text"
                    className="mt-1 block w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div className="mb-6 flex space-x-32">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                  </label>
                  <input
                    name="area"
                    onChange={handelChange}
                    type="text"
                    className="mt-1 block min-w-50 px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal code
                  </label>
                  <input
                    name="pincode"
                    onChange={handelChange}
                    type="text"
                    className="mt-1 block min-w-50 px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              {formData?.propertyType === "pg" ? (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (2 Sharing)
                    </label>
                    <input
                      name="price_2_sharing"
                      onChange={handelChange}
                      type="number"
                      className="mt-1 block w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (3 Sharing)
                    </label>
                    <input
                      name="price_3_sharing"
                      type="number"
                      onChange={handelChange}
                      className="mt-1 block w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (4 Sharing)
                    </label>
                    <input
                      name="price_4_sharing"
                      onChange={handelChange}
                      type="number"
                      className="mt-1 block w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    name="price"
                    type="number"
                    onChange={handelChange}
                    className="mt-1 block w-full px-0 py-2 bg-transparent border-0 border-b-2 border-gray-300 focus:ring-0 focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              )}

              <div className="mb-6">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities
                </span>
                <div className="mt-2 space-y-4 space-x-5">
                  <select name="amenities" onChange={handelChange}>
                    <option value="">Select</option>
                    <option value="AC">AC</option>
                    <option value="No AC">No AC</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  onChange={handelChange}
                  className="outline-gray-300  w-full border-2 py-3 px-3 "
                ></textarea>
              </div>

              <div>
                <input
                  accept="image/*"
                  name="images"
                  style={{ display: "none" }}
                  id="raised-button-file"
                  multiple
                  onChange={handleFileChange}
                  type="file"
                />
                <label htmlFor="raised-button-file">
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() =>
                      document.getElementById("raised-button-file")?.click()
                    }
                  >
                    Upload Images
                  </button>
                </label>
                {formData?.images?.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    {formData.images.length} image(s) selected
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
