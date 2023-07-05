import React from "react";
import styled from "styled-components";

// =============================================================================
// Styled Components
// =============================================================================

const StyledMain = styled.main`
  padding: 20px;
  height: 100vh;
  background-color: #222222;
`;

// =============================================================================
// Main Component
// =============================================================================

// TODO: @PHANTOM-TEAM: Let's improve this UI
export const NoProvider = () => {
  return (
    <StyledMain>
      <h2>Could not find a provider</h2>
    </StyledMain>
  );
};
