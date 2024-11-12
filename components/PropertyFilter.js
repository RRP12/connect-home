"use client";

import React, { useState } from "react";
import { Check, ChevronDown, MapPin, Users, Home } from "lucide-react";

const PropertyFilters = () => {
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState(50000);
  const [location, setLocation] = useState("all");
  const [sharing, setSharing] = useState("any");
  const [filters, setFilters] = useState({
    ac: false,
    food: false,
    kitchen: false,
    veg: false,
  });

  const locations = [
    "Andheri West",
    "Andheri East",
    "Bandra",
    "Juhu",
    "Malad",
    "Goregaon",
  ];
  // max-w-3xl
  return (
    <div className="w-full h-max max-w-37 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Property Filters</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Property Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Property Type</label>
          <div className="flex gap-2">
            {["PG", "Flat", "Room"].map((type) => (
              <button
                key={type}
                onClick={() => setPropertyType(type.toLowerCase())}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  propertyType === type.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Price Range</label>
          <div className="px-3">
            <input
              type="range"
              min="0"
              max="50000"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹0</span>
            <span>₹{parseInt(priceRange).toLocaleString()}</span>
          </div>
        </div>

        {/* Location Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <div className="relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded-lg appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc.toLowerCase()}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Sharing Options */}
        {propertyType === "pg" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Sharing Type</label>
            <div className="flex gap-2">
              {["2", "3", "4"].map((num) => (
                <button
                  key={num}
                  onClick={() => setSharing(num)}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                    sharing === num
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  {num} Sharing
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Amenities</label>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "ac", label: "AC" },
              { key: "food", label: "Food Available" },
              { key: "kitchen", label: "Kitchen Available" },
              { key: "veg", label: "Veg Only" },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <span className="text-sm">{label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={filters[key]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Filters Button */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default PropertyFilters;
