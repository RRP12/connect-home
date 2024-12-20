import * as React from "react"
import styled from "styled-components"

export function SearchResults({ location }) {
  return (
    <ResultsText>
      Results for
      <br />
      {location}
      <br />
    </ResultsText>
  )
}

const ResultsText = styled.div`
  color: #000;
  letter-spacing: 0.5px;
  margin: 31px 0 0 19px;
  font: 400 16px/24px Roboto;
  @media (max-width: 991px) {
    margin-left: 10px;
  }
`
