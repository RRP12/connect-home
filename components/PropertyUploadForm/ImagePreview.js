import React from "react";
import { Box, IconButton, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import Image from "next/image";

const ImagePreview = ({ image, onRemove }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        height: 200,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
          "& .delete-button": {
            opacity: 1,
            transform: "translateY(0)",
          },
          "& .image-overlay": {
            opacity: 1,
          },
        },
      }}
    >
      <Box
        className="image-overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <Image
        src={image.preview}
        alt="Property"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <IconButton
        className="delete-button"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "white",
          opacity: 0,
          transform: "translateY(-8px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            backgroundColor: "white",
            color: red[500],
            transform: "translateY(-8px) scale(1.1)",
          },
        }}
        onClick={() => onRemove(image.id)}
        size="small"
      >
        <DeleteIcon />
      </IconButton>
    </Paper>
  );
};

export default ImagePreview;
