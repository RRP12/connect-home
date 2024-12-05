import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/system";
import BasicDetailsform from "./PropertyUploadForm/basicDetailsform";

const steps = ["Owner Details", "Upload Images", "Default Step"];

const FileInput = styled("input")({
  display: "none",
});

export default function StepperForm() {
  const [activeStep, setActiveStep] = React.useState(0);

  // Form States
  const [ownerName, setOwnerName] = React.useState("");
  const [ownerPhone, setOwnerPhone] = React.useState("");
  const [uploadedFiles, setUploadedFiles] = React.useState([]);

  // Handle Step Changes
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setOwnerName("");
    setOwnerPhone("");
    setUploadedFiles([]);
  };

  // File Upload Handler
  const handleFileChange = (event) => {
    setUploadedFiles([...uploadedFiles, ...event.target.files]);
  };

  // Render Content for Each Step
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Owner Details
        return <BasicDetailsform />;
      case 1: // Upload Images
        return (
          <Box>
            <label htmlFor="upload-files">
              <FileInput
                id="upload-files"
                multiple
                type="file"
                onChange={handleFileChange}
              />
              <Button variant="contained" component="span">
                Upload Images
              </Button>
            </label>
            <Box sx={{ mt: 2 }}>
              {uploadedFiles.length > 0 ? (
                <Typography>
                  Uploaded Files:{" "}
                  {uploadedFiles.map((file) => file.name).join(", ")}
                </Typography>
              ) : (
                <Typography>No files uploaded yet.</Typography>
              )}
            </Box>
          </Box>
        );
      case 2: // Default Step
        return <Typography>Hello World</Typography>;
      default:
        return "Unknown Step";
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - here's the summary:
          </Typography>
          <Typography>Owner Name: {ownerName}</Typography>
          <Typography>Owner Phone: {ownerPhone}</Typography>
          <Typography>
            Uploaded Files:{" "}
            {uploadedFiles.length > 0
              ? uploadedFiles.map((file) => file.name).join(", ")
              : "None"}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Step {activeStep + 1}: {steps[activeStep]}
          </Typography>
          <Box sx={{ mt: 2 }}>{renderStepContent(activeStep)}</Box>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
