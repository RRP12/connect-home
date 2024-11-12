import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { blue, grey } from "@mui/material/colors";

const DropZone = ({
  getRootProps,
  getInputProps,
  isDragActive,
  remainingImages,
}) => {
  return (
    <Paper
      elevation={0}
      {...getRootProps()}
      sx={{
        height: 200,
        border: "2px dashed",
        borderColor: isDragActive ? blue[400] : grey[200],
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backgroundColor: isDragActive ? blue[50] : "white",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: blue[400],
          backgroundColor: blue[50],
          transform: "translateY(-2px)",
          "& .upload-icon": {
            color: blue[400],
            transform: "scale(1.1) translateY(-4px)",
          },
        },
        position: "relative",
        overflow: "hidden",
        boxShadow: isDragActive
          ? "0 4px 20px rgba(33,150,243,0.2)"
          : "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      <input {...getInputProps()} />
      <AddPhotoAlternateIcon
        className="upload-icon"
        sx={{
          fontSize: 56,
          color: isDragActive ? blue[400] : grey[400],
          mb: 2,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
      <Typography
        variant="body1"
        color={isDragActive ? "primary" : "textSecondary"}
        align="center"
        sx={{
          fontWeight: 600,
          mb: 1,
          transition: "color 0.3s ease",
        }}
      >
        {isDragActive ? "Drop images here" : "Drag images here"}
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ opacity: 0.8 }}
      >
        or click to select
      </Typography>
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          px: 2,
          py: 0.75,
          borderRadius: 5,
          backgroundColor: grey[50],
          border: "1px solid",
          borderColor: grey[200],
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        >
          {remainingImages} {remainingImages === 1 ? "spot" : "spots"} remaining
        </Typography>
      </Box>
    </Paper>
  );
};

export default DropZone;
