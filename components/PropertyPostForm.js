"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Box,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  MyLocation as MyLocationIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// In a real application, you would set this in your environment variables
const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

const steps = ["Property Details", "Identity Verification"];

export default function PropertyListingForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState([]);
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [identityProof, setIdentityProof] = useState(null);
  const [pgOptions, setPgOptions] = useState([
    { sharing: "2", price: "" },
    { sharing: "3", price: "" },
    { sharing: "4", price: "" },
  ]);
  const fileInputRef = useRef(null);
  const identityProofRef = useRef(null);
  const supabase = createClientComponentClient();
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (location.length > 2) {
        fetchLocationSuggestions(location);
      } else {
        setLocationSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [location]);

  const fetchLocationSuggestions = async (text) => {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          text
        )}&format=json&apiKey=${API_KEY}`
      );
      const result = await response.json();
      if (result.results) {
        setLocationSuggestions(
          result.results.map((item) => ({
            formatted: item.formatted,
            lat: item.lat,
            lon: item.lon,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleLocationSelect = (suggestion) => {
    setLocation(suggestion.formatted);
    setSelectedLocation(suggestion);
    setLocationSuggestions([]);
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${API_KEY}`
            );
            const result = await response.json();
            if (result.features && result.features.length > 0) {
              const address = result.features[0].properties;
              setLocation(address.formatted);
              setSelectedLocation({
                formatted: address.formatted,
                lat: latitude,
                lon: longitude,
              });
            }
          } catch (error) {
            console.error("Error fetching address from coordinates:", error);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted", {
      propertyType,
      images,
      selectedLocation,
      landmark,
      pincode,
      identityProof,
      pgOptions,
    });

    const { data, error } = await supabase.from("properties").insert([
      {
        property_type: "pg",
        address:
          "gr8 smile dental clinic, krishna alankar, Tejpal Scheme Road 5, Zone 3, Mumbai - 400057, MH, India",
        location: { lat: 19.1068191, lon: 72.8507443 }, // Store latitude and longitude as JSON
        landmark: "Rahul Apartment",
        pincode: "440010",
        identity_proof: "url_to_uploaded_identity_proof",
        pg_options: [
          { sharing: 2, price: "" },
          { sharing: 3, price: "" },
          { sharing: 4, price: "" },
        ],
      },
    ]);

    console.log("data", data);
    console.log("error", error);
  };

  const handleImageChange = (event) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleImageDelete = (id) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
  };

  const handleImageEdit = (id) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      fileInputRef.current.onchange = (event) => {
        if (event.target.files && event.target.files[0]) {
          const newFile = event.target.files[0];
          setImages((prevImages) =>
            prevImages.map((image) =>
              image.id === id
                ? {
                    ...image,
                    file: newFile,
                    preview: URL.createObjectURL(newFile),
                  }
                : image
            )
          );
        }
      };
    }
  };

  const handleIdentityProofUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setIdentityProof({
        file: event.target.files[0],
        name: event.target.files[0].name,
      });
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Property Title"
                variant="outlined"
                placeholder="e.g. Cozy 2-bedroom apartment"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                placeholder="Describe your property..."
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                variant="outlined"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={getCurrentLocation}>
                      <MyLocationIcon />
                    </IconButton>
                  ),
                }}
              />
              {locationSuggestions.length > 0 && (
                <List>
                  {locationSuggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleLocationSelect(suggestion)}
                    >
                      <ListItemText primary={suggestion.formatted} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Landmark"
                variant="outlined"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Central Park"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Pincode"
                variant="outlined"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price"
                variant="outlined"
                type="number"
                placeholder="Enter price"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Property Type</InputLabel>
                <Select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  label="Property Type"
                >
                  <MenuItem value="apartment">Apartment</MenuItem>
                  <MenuItem value="house">House</MenuItem>
                  <MenuItem value="condo">Condo</MenuItem>
                  <MenuItem value="townhouse">Townhouse</MenuItem>
                  <MenuItem value="pg">PG (Paying Guest)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {propertyType === "pg" && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  PG Options
                </Typography>
                {[2, 3, 4].map((sharingOption) => (
                  <Grid
                    container
                    spacing={2}
                    key={sharingOption}
                    style={{ marginBottom: "10px" }}
                  >
                    <Grid item xs={6}>
                      <Typography>{sharingOption} Sharing</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label={`${sharingOption} Sharing Price`}
                        variant="outlined"
                        type="number"
                        placeholder="Enter price"
                      />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            )}
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span">
                  Upload Property Images
                </Button>
              </label>
            </Grid>
            {images.length > 0 && (
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {images.map((image) => (
                    <Grid item xs={6} key={image.id}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={image.preview}
                          alt="Property preview"
                          style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          style={{ position: "absolute", top: 5, right: 5 }}
                          onClick={() => handleImageDelete(image.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          style={{ position: "absolute", top: 5, right: 40 }}
                          onClick={() => handleImageEdit(image.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Identity Verification
              </Typography>
              <Alert severity="info" style={{ marginBottom: "20px" }}>
                Verifying your identity improves your credibility as a property
                owner. It helps build trust with potential renters and increases
                the visibility of your listing.
              </Alert>
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*,.pdf"
                style={{ display: "none" }}
                id="identity-proof-upload"
                type="file"
                onChange={handleIdentityProofUpload}
                ref={identityProofRef}
              />
              <label htmlFor="identity-proof-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Identity Proof
                </Button>
              </label>
              <Typography variant="caption" display="block" gutterBottom>
                Please upload a clear image or PDF of your electricity bill or
                Aadhaar card.
              </Typography>
            </Grid>
            {identityProof && (
              <Grid item xs={12}>
                <Alert severity="success">
                  File uploaded: {identityProof.name}
                </Alert>
              </Grid>
            )}
          </Grid>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Paper style={{ padding: "20px", margin: "20px auto", maxWidth: 600 }}>
      <Typography variant="h4" align="center" gutterBottom>
        List Your Property
      </Typography>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        style={{ marginBottom: "20px" }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit}>
        {getStepContent(activeStep)}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="contained"
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={
              activeStep === steps.length - 1 ? handleSubmit : handleNext
            }
          >
            {activeStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
