"use client"

import { Box, Container } from "@mui/material"
import { useState } from "react"
import PropertyPostForm from "./basicDetailsform"
import StepperForm from "../stepperFrom"


export default function PropertyListingForm() {
  const [currentStep, setcurrentStep] = useState(0)
  return (
    <Container maxWidth="md">
      <Box sx={{ height: "100vh" }}>
        <PropertyPostForm />
        <StepperForm />
      </Box>
    </Container>
  )
}
