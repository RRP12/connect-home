"use client";
import { useState } from "react";
import { Modal, Box, IconButton } from "@mui/material";
import { ArrowBack, ArrowForward, Close } from "@mui/icons-material";
import Image from "next/image";

const ImageGallery = ({ images }) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}
    >
      {/* Image Thumbnails */}
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={`Image ${index + 1}`}
          style={{ width: "100%", cursor: "pointer" }}
          onClick={() => handleOpen(index)}
        />
      ))}

      {/* Modal for Full-Screen View */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 16, right: 16, color: "white" }}
          >
            <Close />
          </IconButton>

          {/* Previous Button */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 16,
              color: "white",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <ArrowBack />
          </IconButton>

          {/* Display Current Image */}
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />

          {/* Next Button */}
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 16,
              color: "white",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>
      </Modal>
    </Box>
  );
};

export default ImageGallery;
