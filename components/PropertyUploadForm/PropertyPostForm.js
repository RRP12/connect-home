"use client";

import { Typography } from "@mui/material";
import { useState } from "react";
import BaiscDetils from "./basicDetailsform";
import MultistepForm from "../MultistepForm";

export default function PropertyListingForm() {
  const [currentStep, setcurrentStep] = useState(0);
  return (
    <>
      <Typography variant="h1" component="h2">
        Please add the property details
      </Typography>

      {/* <BaiscDetils /> */}
      <MultistepForm />
    </>
  );
}
