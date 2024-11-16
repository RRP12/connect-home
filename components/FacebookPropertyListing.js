"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import img1 from "../assets/image1.jpg";
import img2 from "../assets/image2.jpg";
import img3 from "../assets/image3.jpg";
import img4 from "../assets/img4.jpg";
import Link from "next/link";
import { Typography } from "@mui/material";

const images = [img4, img1, img2, img3];

const FacebookPropertyPost = ({ property }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formattedPropertyData = {
    propertyType: property.property_type,
    title: property.title,
    createdAt: new Date(property.created_at).toLocaleDateString(),
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Key press navigation when modal is open
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isModalOpen) {
        if (event.key === "ArrowRight") {
          nextImage();
        } else if (event.key === "ArrowLeft") {
          prevImage();
        } else if (event.key === "Escape") {
          closeModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <div className="max-w-xl bg-white rounded-lg shadow">
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
              <h3 className="font-semibold">Ayesha Shaikh</h3>
              <p className="text-xs text-gray-500">
                {formattedPropertyData?.createdAt}
              </p>
            </div>
            <button className="text-gray-400">...</button>
          </div>

          <div className="mt-3 space-y-1 text-sm">
            <Typography sx={{ fontFamily: "Roboto" }} variant="h6">
              {formattedPropertyData?.title}
            </Typography>
            <p>🌟🎄 Festive season offers 🤝💫</p>
            <p>*SINGLE OCCUPANCY* #male</p>
            <p className="text-blue-600">
              #LUXURIOUS #BEAUTIFUL #FULLYFURNISHED #BI... अधिक पढ़ें
            </p>
          </div>
        </div>
      </Link>

      <div className="grid grid-cols-6 grid-rows-2 gap-1">
        <div className="col-span-6 row-span-1 h-64 bg-gray-100">
          <Image
            src={img4}
            alt="City skyline"
            onClick={() => openModal(0)}
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>
        <div className="col-span-2 h-32 bg-gray-100">
          <Image
            src={img1}
            alt="Interior detail"
            onClick={() => openModal(1)}
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>
        <div className="col-span-2 h-32 bg-gray-100">
          <Image
            src={img2}
            alt="Night view"
            onClick={() => openModal(2)}
            className="w-full h-full object-cover cursor-pointer"
          />
        </div>
        <div className="col-span-2 h-32 relative bg-gray-100">
          <Image
            src={img3}
            alt="Garden view"
            onClick={() => openModal(3)}
            className="w-full h-full object-cover cursor-pointer"
          />
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-sm">
            2/29
          </div>
        </div>
      </div>

      <div className="p-2 border-t mt-1">
        <div className="grid grid-cols-4 gap-1">
          {["लाइक", "टिप्पणी", "शेयर", "सामाजिक करें"].map((text) => (
            <button
              key={text}
              className="flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <span>{text}</span>
            </button>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeModal}
          >
            ×
          </button>
          <button
            className="absolute left-4 text-white text-2xl"
            onClick={prevImage}
          >
            ‹
          </button>
          <Image
            src={images[currentImageIndex]}
            alt="Selected property image"
            className="max-w-full max-h-full object-cover"
          />
          <button
            className="absolute right-4 text-white text-2xl"
            onClick={nextImage}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default FacebookPropertyPost;
