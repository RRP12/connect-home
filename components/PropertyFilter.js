"use client";

import React, { useState } from "react";

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

  return (
    <div className="max-w-3xl bg-white rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-bold">Property Filters</h2>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Property Type</label>
        <div className="flex gap-2">
          {["PG", "Flat", "Room"].map((type) => (
            <button
              key={type}
              onClick={() => setPropertyType(type.toLowerCase())}
              className={`flex-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                propertyType === type.toLowerCase()
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 hover:bg-purple-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Price Range</label>
        <input
          type="range"
          min="0"
          max="50000"
          value={priceRange}
          onChange={(e) => setPriceRange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹0</span>
          <span>₹{priceRange.toLocaleString()}</span>
        </div>
      </div>

      {/* <div className="space-y-2">
        <label className="block text-sm font-medium">Location</label>
        <div className="relative">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-purple-500 appearance-none"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc.toLowerCase()}>
                {loc}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </div> */}

      {propertyType === "pg" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Sharing Type</label>
          <div className="flex gap-2">
            {["2", "3", "4"].map((num) => (
              <button
                key={num}
                onClick={() => setSharing(num)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors ${
                  sharing === num
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 hover:bg-purple-100"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {num} Sharing
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium">Amenities</label>
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
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-purple-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-blue-400 text-white py-3 rounded-lg transition-colors font-medium">
        Apply Filters
      </button>
    </div>
  );
};

export default PropertyFilters;
