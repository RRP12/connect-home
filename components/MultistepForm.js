import React, { useState } from "react";
import { Stepper, Step, StepLabel, Button } from "@mui/material";

import BaiscDetils from "./PropertyUploadForm/basicDetailsform";
import { useForm } from "react-hook-form";

const steps = ["Enter Your Details", "Verify"];

const MultistepForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      property_Images: [],
    },
  });
  const onSubmit = (values) => console.log("values", values);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFormData = (data) => {
    setFormData((prevFormData) => ({ ...prevFormData, ...data }));
  };

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === 0 && (
          <BaiscDetils
            handleSubmit={handleSubmit}
            register={register}
            onSubmit={onSubmit}
            handleNext={handleNext}
            errors={errors}
            handleFormData={handleFormData}
            reset={reset}
            control={control}
          />
        )}
        {activeStep === 1 && <>helloe me</>}
      </div>
      <Button onClick={handleBack} disabled={activeStep === 0}>
        Back
      </Button>
      <Button variant="contained" color="primary" onClick={handleNext}>
        {activeStep === steps.length - 1 ? "Submit" : "Next"}
      </Button>
    </div>
  );
};

export default MultistepForm;
