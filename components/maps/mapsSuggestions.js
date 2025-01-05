import React, { useState } from "react"

const locations = [
  {
    id: 1,
    name: "Infiniti Mall",
    coordinates: [19.1362, 72.8337],
    description: "Popular shopping destination",
  },
  {
    id: 2,
    name: "Azad Nagar Metro",
    coordinates: [19.1334, 72.8324],
    description: "Metro station",
  },
  {
    id: 3,
    name: "Andheri Sports Complex",
    coordinates: [19.1296, 72.8419],
    description: "Sports facility",
  },
  {
    id: 4,
    name: "DN Nagar",
    coordinates: [19.1277, 72.8292],
    description: "Residential area",
  },
]

const userLocation = [19.127, 72.8326]
const MAP_BOUNDS = {
  minLat: 19.12,
  maxLat: 19.14,
  minLng: 72.82,
  maxLng: 72.85,
}

const MapInterface = ({ recommenedByAi }) => {
  console.log("recommenedByAi", recommenedByAi)

  const [selectedLocation, setSelectedLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const calculateDistance = (point1, point2) => {
    const R = 6371
    const lat1 = (point1[0] * Math.PI) / 180
    const lat2 = (point2[0] * Math.PI) / 180
    const deltaLat = ((point2[0] - point1[0]) * Math.PI) / 180
    const deltaLon = ((point2[1] - point1[1]) * Math.PI) / 180

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c).toFixed(2)
  }

  const getPixelCoordinates = (lat, lng) => {
    const x =
      ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
      100
    const y =
      ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
      100
    return [x, y]
  }

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-white p-4 overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4">Nearby Locations</h2>
        <input
          type="text"
          placeholder="Search locations..."
          className="w-full mb-4 p-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="space-y-3">
          {recommenedByAi.map((p) => (
            <div
              key={p?.property_title}
              className="p-3 border rounded cursor-pointer text-green-300 transition-all hover:bg-gray-100"
            >
              {p?.property_title}
            </div>
          ))}
          {/* {recommenedByAi?.map((location) => (
            <div
              key={location.id}
              className={`p-3 border rounded cursor-pointer transition-all hover:bg-gray-100 ${
                selectedLocation?.id === location.id ? "bg-blue-100" : ""
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              <h3 className="font-semibold">{location.property_title}</h3>
              <p className="text-sm text-gray-600">{location.description}</p>
              {selectedLocation?.id === location.id && (
                <div className="mt-2 text-sm text-blue-600">
                  {calculateDistance(userLocation, location.coordinates)} km
                  away
                </div>
              )}
            </div>
          ))} */}
          {/* {filteredLocations.map((location) => (
            <div
              key={location.id}
              className={`p-3 border rounded cursor-pointer transition-all hover:bg-gray-100 ${
                selectedLocation?.id === location.id ? "bg-blue-100" : ""
              }`}
              onClick={() => setSelectedLocation(location)}
            >
              <h3 className="font-semibold">{location.name}</h3>
              <p className="text-sm text-gray-600">{location.description}</p>
              {selectedLocation?.id === location.id && (
                <div className="mt-2 text-sm text-blue-600">
                  {calculateDistance(userLocation, location.coordinates)} km
                  away
                </div>
              )}
            </div>
          ))} */}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gray-100 p-4">
        <div className="absolute inset-4 bg-white rounded-lg shadow-lg overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ background: "#f0f0f0" }}
          >
            {/* Background Grid */}
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="#e5e5e5"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Location Markers */}
            {locations.map((location) => {
              const [x, y] = getPixelCoordinates(
                location.coordinates[0],
                location.coordinates[1]
              )
              return (
                <g key={location.id} transform={`translate(${x}, ${y})`}>
                  <circle
                    r="2"
                    fill={
                      selectedLocation?.id === location.id
                        ? "#3b82f6"
                        : "#ef4444"
                    }
                    stroke="white"
                    strokeWidth="1"
                    onClick={() => setSelectedLocation(location)}
                    className="cursor-pointer"
                  />
                  <text
                    x="3"
                    y="0"
                    fontSize="4"
                    fill="#374151"
                    dominantBaseline="middle"
                  >
                    {location.name}
                  </text>
                </g>
              )
            })}

            {/* User Location */}
            {(() => {
              const [x, y] = getPixelCoordinates(
                userLocation[0],
                userLocation[1]
              )
              return (
                <g transform={`translate(${x}, ${y})`}>
                  <circle r="2" fill="#22c55e" stroke="white" strokeWidth="1" />
                  <text
                    x="3"
                    y="0"
                    fontSize="4"
                    fill="#374151"
                    dominantBaseline="middle"
                  >
                    You are here
                  </text>
                </g>
              )
            })()}

            {/* Path to Selected Location */}
            {selectedLocation &&
              (() => {
                const [x1, y1] = getPixelCoordinates(
                  userLocation[0],
                  userLocation[1]
                )
                const [x2, y2] = getPixelCoordinates(
                  selectedLocation.coordinates[0],
                  selectedLocation.coordinates[1]
                )
                return (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#3b82f6"
                    strokeWidth="0.5"
                    strokeDasharray="2,1"
                  />
                )
              })()}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default MapInterface
