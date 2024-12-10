"use client"

import styled from "styled-components"

const Container = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  gap: 10% !important;
  justify-content: center;
  flex-wrap: wrap;

  /* Default styling for mobile */
  font-size: 14px;

  /* Breakpoint for tablets (768px and above) */
  @media (min-width: 768px) {s
    font-size: 16px;
    padding: 40px;
    gap: 20px;
  }

  /* Breakpoint for desktops (1024px and above) */
  @media (min-width: 1024px) {
    font-size: 18px;
    padding: 60px;
    gap: 30px;
  }
`

export default Container
