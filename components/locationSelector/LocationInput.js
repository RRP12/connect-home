import * as React from "react";
import styled from "styled-components";

export function LocationInput({ onChange }) {
  const handleChange = (e) => {
    onChange?.(e.target.checked);
  };

  return (
    <LocationInputWrapper>
      <LocationIcon
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/702ee605e2e4172266eed67abcd66d1800165cb8d0b3ac06ad8f5bb4daa11601?placeholderIfAbsent=true&apiKey=d1323209424d42209255fa5fb2f0a698"
        alt="Location pin icon"
      />

      <LocationLabel>get current location</LocationLabel>
    </LocationInputWrapper>
  );
}

const LocationInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
`;

const LocationIcon = styled.img`
  aspect-ratio: 1;
  object-fit: contain;
  object-position: center;
  width: 24px;
  fill: grey;
  color: grey;
  stroke: grey;
`;

const LocationFieldset = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  height: 24px;
`;

const LocationLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;
