import React, { useRef } from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { Box, Button, Grid, IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const ImageUpload = ({ control }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "property_Images", // Use property_Images for the field name
    keyName: "property_Image", // Make sure the key name matches
  });

  const hiddenFileInput = useRef(null);

  const handleAddDocuments = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const files = uploadedFiles.map((file) => ({ file }));
    append(files);
    hiddenFileInput.current.value = ""; // Reset the file input
  };

  const handleClickAddDocuments = () => {
    hiddenFileInput.current.click();
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={hiddenFileInput}
        type="file"
        multiple
        onChange={handleAddDocuments}
        style={{ display: "none" }}
      />

      <Box sx={{ m: 2, width: 300 }}>
        <h1>Property Images</h1>
        {/* Render uploaded images */}
        {fields.map(({ property_Image, file }, index) => (
          <div key={property_Image}>
            <Controller
              control={control}
              name={`property_Images.${index}`} // Correctly bind to property_Images array
              render={() => (
                <Grid container alignItems="center">
                  <Grid item xs={10}>
                    {file.name}
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      aria-label="Remove"
                      onClick={() => remove(index)} // Remove selected image
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              )}
            />
          </div>
        ))}

        {/* Button to add more images */}
        <Button variant="text" onClick={handleClickAddDocuments}>
          Add images
        </Button>
      </Box>
    </>
  );
};

export default ImageUpload;
