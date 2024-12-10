"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import img1 from "../assets/image1.jpg"
import img2 from "../assets/image2.jpg"
import img3 from "../assets/image3.jpg"
import img4 from "../assets/img4.jpg"
import Link from "next/link"

const images = [img4, img1, img2, img3, img4, img2]

const PropertyCard = ({ property, title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const formattedPropertyData = {
    propertyType: property?.property_type,
    title: property?.title,
    createdAt: new Date(property?.created_at).toLocaleDateString(),
  }

  const openModal = (index) => {
    setCurrentImageIndex(index)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    )
  }

  // Key press navigation when modal is open
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isModalOpen) {
        if (event.key === "ArrowRight") {
          nextImage()
        } else if (event.key === "ArrowLeft") {
          prevImage()
        } else if (event.key === "Escape") {
          closeModal()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isModalOpen])

  // async function getlocation(property) {
  //   const apiKey = process.env.Location_key; // Correct API key access

  //   let [longitude, latitude] = property?.location?.coordinates;

  //   try {
  //     const response = await fetch(
  //       `https://us1.locationiq.com/v1/reverse?key=pk.1f9c41d0bd69b268097b057cd9345bfd&lat=${longitude}&lon=${latitude}&format=json&addressdetails=1`
  //     );
  //     const data = await response.json();
  //     return data; // Return the fetched location data
  //   } catch (error) {
  //     console.error("Error fetching location:", error);
  //     return null; // Return null in case of error
  //   }
  // }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (property) {
  //       const data = await getlocation(property); // Fetch the location data
  //       setLocationData(data); // Set the data in state
  //     }
  //   };

  //   fetchData(); // Call the async function
  // }, [property]);

  const imageDetails = images.map((image) => {
    let area = image.height * image.width // Calculate the area
    return {
      src: image.src,
      height: image.height,
      width: image.width,
      area: area,
    }
  })

  let sortedImages = imageDetails?.sort((a, b) => b.area - a.area)

  return (
    <div className=" flex flex-col gap-6 max-w-xl bg-white rounded-lg shadow border border-cyan-100 p-2">
      <Link href={`/property/${property?.id}`}>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={img4}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="subpixel-antialiased indent-1 text-gray-500 text-lg font-extralight">
                {property?.property_title}
              </h3>
              <p className="text-xs text-gray-500">{property?.created_at}</p>
            </div>
            <button className="text-gray-400">...</button>
          </div>

          <div className="mt-3 space-y-1 text-sm">
            <p>{formattedPropertyData?.title}</p>
            <p>🌟🎄 Festive season offers 🤝💫</p>
            <p>*SINGLE OCCUPANCY* #male</p>
            <p className="text-blue-600">
              #LUXURIOUS #BEAUTIFUL #FULLYFURNISHED #BI... अधिक पढ़ें
            </p>

            <div>
              <h1 className="text-gray-500 text-sm">
                <span className="font-bold">Price</span> {property?.price}
              </h1>
              <span className="text-gray-500 text-sm">Address</span>

              <p className="grey-500">{property?.address}</p>
            </div>
          </div>
        </div>
      </Link>

      <div className="border-l-8 grid grid-cols-6 gap-1">
        {sortedImages?.length > 0 && (
          <div className="col-span-6 row-span-1 h-64 bg-gray-100">
            <Image
              src={sortedImages[0].src} // First image
              alt={sortedImages[0].alt || ""}
              width={sortedImages[0].width}
              height={sortedImages[0].height}
              onClick={() => openModal(0)} // First image click
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
        )}

        {/* Next 2 Images (2nd to 3rd) */}
        {sortedImages?.slice(1, 3).map((image, index) => (
          <div key={index} className="col-span-2 h-32 bg-gray-100">
            <Image
              src={image.src}
              alt={image.alt || ""}
              width={image.width}
              height={image.height}
              onClick={() => openModal(index + 1)} // Adjust index for modal
              className="w-full h-full object-cover cursor-pointer"
            />
          </div>
        ))}

        {sortedImages?.length > 3 && (
          <div className="col-span-2 h-32 relative bg-gray-100">
            <Image
              src={sortedImages[3].src} // 4th image
              alt={sortedImages[3].alt || ""}
              width={sortedImages[3].width}
              height={sortedImages[3].height}
              onClick={() => openModal(3)} // Open modal for the 4th image
              className="w-full h-full object-cover cursor-pointer"
            />
            {sortedImages.length > 4 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xl font-bold">
                +{sortedImages.length - 4} more
              </div>
            )}
          </div>
        )}
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black/70 z-50 transition-all duration-300"
          onClick={closeModal} // Close the modal when clicking outside
        >
          <div
            className="relative bg-white w-full max-w-4xl h-auto flex flex-col justify-center items-center p-6 rounded-lg shadow-lg transition-transform transform scale-90 hover:scale-100"
            onClick={(e) => e.stopPropagation()} // Prevent close on inner content click
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white bg-gray-800 hover:bg-gray-700 rounded-full p-3 transition-all ease-in-out duration-200 z-10"
            >
              ✕
            </button>

            {/* Image Display */}
            <div className="flex justify-center items-center flex-grow w-full">
              <Image
                src={images[currentImageIndex].src} // Image source
                alt={`Modal Image ${currentImageIndex + 1}`}
                layout="intrinsic"
                width={1200} // Adjust width for full-screen display
                height={800} // Adjust height for full-screen display
                className="object-contain max-w-full max-h-full rounded-lg shadow-md"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="absolute bottom-4 flex justify-between w-full px-8 z-10">
              <button
                onClick={prevImage}
                className="text-white bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg transition-all ease-in-out duration-200"
              >
                Prev
              </button>
              <button
                onClick={nextImage}
                className="text-white bg-gray-800 hover:bg-gray-700 p-3 rounded-full shadow-lg transition-all ease-in-out duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-2 border-t mt-1">
        <div className="grid grid-cols-4 gap-1">
          {["like", "comment", "share", "review"].map((text) => (
            <button
              key={text}
              className="flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <span>{text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertyCard
