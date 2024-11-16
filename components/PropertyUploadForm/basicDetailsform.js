"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie"; // Using js-cookie instead of next/headers
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Alert } from "@mui/material"; // Import MUI Alert

import { Controller } from "react-hook-form";
import ImageUpload from "../imageUpload/imageupload";
import UploadImagetest from "../../testCoomponets/Imageuploadtest";
const BasicDetails = ({
  handleSubmit,
  register,
  errors,
  reset,
  control,
  onSubmit,
}) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To display errors like duplicate key

  const supabase = createClientComponentClient({ cookies: Cookies.get() });

  // Handle form submission
  // const handleFormSubmit = async (data) => {
  //   onSubmit(data);
  //   try {
  //     // Insert data into the properties table
  //     const { error } = await supabase.from("properties").insert([
  //       {
  //         title: data.propertyTitle,
  //         location:
  //           data.location || `${location.latitude}, ${location.longitude}`,
  //         landmark: data.landmark,
  //         pincode: data.pincode,
  //         property_type: data.propertyType,
  //       },
  //     ]);

  //     if (error) {
  //       // Check if the error is a duplicate key violation
  //       if (error.code === "23505") {
  //         setErrorMessage(
  //           "The property title already exists. Please choose a different title."
  //         );
  //       } else {
  //         setErrorMessage("An error occurred while submitting your form.");
  //       }
  //       throw error; // Stop further execution if error occurred
  //     }

  //     // Reset form and states if submission is successful
  //     reset(); // Reset form fields
  //     setLocation({ latitude: null, longitude: null });
  //     setStatus("");
  //     setErrorMessage(""); // Clear error message
  //     alert("Property details added successfully!");
  //     onSubmit();
  //   } catch (error) {
  //     console.error("Error inserting data:", error);
  //   }
  // };

  // const handleFormSubmit = async (data) => {
  //   // onSubmit(data);
  //   // try {
  //   //   // Check if there are any images in the form data
  //   //   const imageUploadPromises = data.property_Images.map(async (image) => {
  //   //     // Create a unique file name (you can use a timestamp or UUID)
  //   //     const fileName = `${Date.now()}_${image.name}`;
  //   //     const filePath = `property_Images/${fileName}`;

  //   //     // console.log("filePath", filePath);

  //   //     // Upload the image to Supabase Storage
  //   //     const { data: uploadedData, error: uploadError } =
  //   //       await supabase.storage
  //   //         .from("property-images") // Assuming 'property_images' is your bucket name
  //   //         .upload(filePath, image.file);

  //   //     if (uploadError) {
  //   //       throw new Error(`Error uploading image: ${uploadError.message}`);
  //   //     }

  //   //     // Get the public URL for the uploaded image
  //   //     const publicUrl = supabase.storage
  //   //       .from("property_images")
  //   //       .getPublicUrl(filePath).publicURL;

  //   //     return publicUrl;
  //   //   });

  //   //   // Wait for all image uploads to complete
  //   //   const imageUrls = await Promise.all(imageUploadPromises);

  //   //   // Insert data into the properties table
  //   //   const { error } = await supabase.from("properties").insert([
  //   //     {
  //   //       title: data.propertyTitle,
  //   //       location:
  //   //         data.location || `${location.latitude}, ${location.longitude}`,
  //   //       landmark: data.landmark,
  //   //       pincode: data.pincode,
  //   //       property_type: data.propertyType,
  //   //       property_images: imageUrls, // Store the image URLs
  //   //     },
  //   //   ]);

  //   //   if (error) {
  //   //     // Handle errors
  //   //     if (error.code === "23505") {
  //   //       setErrorMessage(
  //   //         "The property title already exists. Please choose a different title."
  //   //       );
  //   //     } else {
  //   //       setErrorMessage(
  //   //         "An error occurred while submitting your form. Please try again."
  //   //       );
  //   //     }
  //   //     throw error;
  //   //   }

  //   //   // Reset form and states after successful submission
  //   //   reset();
  //   //   setLocation({ latitude: null, longitude: null });
  //   //   setStatus("");
  //   //   setErrorMessage("");

  //   //   alert("Property details added successfully!");

  //   //   // Trigger the onSubmit callback after successful submission
  //   //   onSubmit(data);
  //   // } catch (error) {
  //   //   console.error("Error inserting data:", error);
  //   //   setErrorMessage("An unexpected error occurred. Please try again later.");
  //   // }
  // };
  const checkImageFiles = async (images) => {
    if (!images || images.length === 0) {
      console.log("No images found");
    } else {
      images.forEach((image, index) => {
        if (!image || !image.file || !image.file.name) {
          console.log(`Image at index ${index} is missing or invalid:`, image);
        } else {
          console.log(`Image at index ${index} is valid:`, image.file.name);
        }
      });

      const imageUploadPromises = images.map(async (image) => {
        if (image.file) {
          const fileName = `${Date.now()}_${image.file.name}`; // Generate unique file name
          const filePath = `property-images/${fileName}`; // Correct file path format
          console.log("filePath", filePath);

          // Upload the image to Supabase Storage (bucket: 'property-images')
          const { data: uploadedData, error: uploadError } =
            await supabase.storage
              .from("property-images") // Correct bucket name
              .upload(filePath, image.file);

          if (uploadError) {
            console.log("Upload Error:", uploadError);
            throw new Error(`Error uploading image: ${uploadError.message}`);
          }

          console.log("Uploaded Data:", uploadedData); // Check the upload data

          // Use the correct `path` instead of `fullPath` for public URL
          const { publicURL, error: urlError } = supabase.storage
            .from("property-images")
            .getPublicUrl(uploadedData.path); // Use uploadedData.path

          if (urlError) {
            console.log("URL Retrieval Error:", urlError);
            throw new Error(`Error retrieving public URL: ${urlError.message}`);
          }

          console.log("Generated Public URL:", publicURL);
          return publicURL; // Return the public URL for later use (e.g., storing it in the DB)
        }

        const publicUrl = supabase.storage
          .from("property-images")
          .getPublicUrl(uploadedData.path).publicURL;

        console.log("publicUrl", publicUrl);
      });

      // Wait for all image uploads and public URLs
      const imageUrls = await Promise.all(imageUploadPromises);
      console.log("All image URLs:", imageUrls);
      return imageUrls; // Return image URLs for further processing (e.g., saving in the database)
    }
  };

  const handleFormSubmit = async (data) => {
    // checkImageFiles(data.property_Images);

    const imageUploadPromises = data.property_Images.map(async (image) => {
      const fileName = `${Date.now()}_${image.file.name}`;
      const filePath = `property-images/${fileName}`;

      // Upload the image to Supabase storage
      const { data: uploadedData, error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(filePath, image.file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw new Error("Error uploading file");
      }

      // Step 2: Get the public URL of the uploaded file
      const publicUrl = supabase.storage
        .from("property-images")
        .getPublicUrl(uploadedData.path).publicURL;

      console.log("Generated Public URL:", publicUrl);
      return publicUrl;
    });

    // Wait for all image uploads to complete and get the URLs
    const imageUrls = await Promise.all(imageUploadPromises);
    console.log("All image URLs:", imageUrls);

    // Step 3: Insert the image URLs into the `properties` table
    const { error: insertError } = await supabase.from("properties").insert([
      {
        title: data.propertyTitle,
        location:
          data.location || `${location.latitude}, ${location.longitude}`,
        landmark: data.landmark,
        pincode: data.pincode,
        property_type: data.propertyType,
        images: imageUrls, // Store the URLs in the 'images' column
      },
    ]);

    // try {
    //   // Check if there are any images in the form data
    //   const imageUploadPromises = data.property_Images.map(async (image) => {
    //     // Generate a unique file name
    //     const fileName = `${Date.now()}_${image.file.name}`;
    //     const filePath = `property-images/${fileName}`; // Correct bucket name
    //     console.log("filePath", filePath);
    //     // Upload the image to Supabase Storage (bucket: 'property-images')
    //     const { data: uploadedData, error: uploadError } =
    //       await supabase.storage
    //         .from("property-images") // Your correct bucket name: 'property-images'
    //         .upload(filePath, image.file);
    //     if (uploadError) {
    //       throw new Error(`Error uploading image: ${uploadError.message}`);
    //     }
    //     // Get the public URL for the uploaded image
    //     const publicUrl = supabase.storage
    //       .from("property-images") // Correct bucket name
    //       .getPublicUrl(filePath).publicURL;
    //     return publicUrl;
    //   });
    //   // Wait for all image uploads to complete
    //   const imageUrls = await Promise.all(imageUploadPromises);
    //   // Insert data into the properties table, storing the image URLs as JSON
    //   const { error } = await supabase.from("properties").insert([
    //     {
    //       title: data.propertyTitle,
    //       location:
    //         data.location || `${location.latitude}, ${location.longitude}`,
    //       landmark: data.landmark,
    //       pincode: data.pincode,
    //       property_type: data.propertyType,
    //       images: imageUrls, // Store the image URLs as a JSON array
    //     },
    //   ]);
    //   if (error) {
    //     // Handle errors (like a unique constraint violation for title)
    //     if (error.code === "23505") {
    //       setErrorMessage(
    //         "The property title already exists. Please choose a different title."
    //       );
    //     } else {
    //       setErrorMessage(
    //         "An error occurred while submitting your form. Please try again."
    //       );
    //     }
    //     throw error;
    //   }
    //   // Reset form and states after successful submission
    //   reset();
    //   setLocation({ latitude: null, longitude: null });
    //   setStatus("");
    //   setErrorMessage("");
    //   alert("Property details added successfully!");
    //   // Trigger the onSubmit callback after successful submission
    //   onSubmit(data);
    // } catch (error) {
    //   console.error("Error inserting data:", error);
    //   setErrorMessage("An unexpected error occurred. Please try again later.");
    // }
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
      <ImageUpload control={control} />
      {/* <UploadImagetest /> */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default BasicDetails;
