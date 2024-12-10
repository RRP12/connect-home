"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useState } from "react";

export default function PropertyCard({ property }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(
    property.property_title || "Untitled Property"
  );

  let supabase = createClientComponentClient();
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSave = async () => {
  

    const { data, error } = await supabase
      .from("properties")
      .update({ property_title: title })
      .eq("id", property?.id)
      .select();

    

    setIsEditing(false);
  };

  return (
    <div
      key={property?.id}
      className="border border-gray-200 rounded-lg shadow-lg p-5 bg-gray-50 hover:shadow-xl transition-shadow"
    >
      <div className="flex justify-between items-center mb-3">
        {isEditing ? (
          <>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="border border-gray-300 rounded px-2 py-1 w-full"
            />
            <button
              onClick={handleSave}
              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={handleEditToggle}
              className="ml-2 bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 transition"
            >
              Edit
            </button>
          </>
        )}
      </div>
      <div className="text-gray-700 text-sm space-y-2">
        <p>
          <strong>Price:</strong> ₹{property.price || "N/A"}
        </p>
        <p>
          <strong>City:</strong> {property.city || "N/A"}
        </p>
        <p>
          <strong>Amenities:</strong>{" "}
          {Array.isArray(property.amenities)
            ? property.amenities.join(", ")
            : property.amenities || "N/A"}
        </p>
      </div>
    </div>
  );
}
