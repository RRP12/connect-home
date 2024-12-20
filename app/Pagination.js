import * as React from "react"
import styled from "styled-components"

export function Pagination({ pages }) {
  return (
    <PaginationContainer>
      {pages.map((page, index) => (
        <React.Fragment key={page.page}>
          {index === 3 && <PaginationGap>...</PaginationGap>}
          <PaginationButton isActive={page.isActive}>
            {page.page}
          </PaginationButton>
        </React.Fragment>
      ))}
    </PaginationContainer>
  )
}

const PaginationContainer = styled.nav`
  display: flex;
  margin-top: 322px;
  height: 24px;
  align-items: center;
  gap: 8px;
  color: var(--sds-color-text-default-default);
  white-space: nowrap;
  justify-content: start;
  font: var(--sds-typography-body-font-weight-regular)
    var(--sds-typography-body-size-medium) / 1
    var(--sds-typography-body-font-family);
  @media (max-width: 991px) {
    margin-top: 40px;
    white-space: initial;
  }
`

const PaginationButton = styled.button`
  border-radius: 8px;
  background-color: ${(props) => (props.isActive ? "#2c2c2c" : "transparent")};
  color: ${(props) =>
    props.isActive ? "var(--sds-color-text-brand-on-brand)" : "inherit"};
  width: 32px;
  height: 32px;
  border: none;
  cursor: pointer;
  padding: 8px 12px;
  @media (max-width: 991px) {
    white-space: initial;
  }
`

const PaginationGap = styled.span`
  border-radius: 8px;
  color: var(--black-100, #000);
  padding: 8px 16px;
  font: var(--sds-typography-weight-bold) var(--sds-typography-scale-03) / 1.4
    var(--sds-typography-family-sans);
  @media (max-width: 991px) {
    white-space: initial;
  }
`
