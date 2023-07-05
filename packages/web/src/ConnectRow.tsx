import React from "react";
import { PublicKey } from "@solana/web3.js";
import styled from "styled-components";

import { REACT_GRAY, PURPLE, WHITE, DARK_GRAY } from "./constants";

import hexToRGB from "./utils/hexToRGB";

import Button from "./components/Button";
import { ConnectedMethods } from "./utils/useProviderProps";

// =============================================================================
// Styled Components
// =============================================================================

const Main = styled.main`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  align-items: center;
  background-color: ${REACT_GRAY};
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Pre = styled.pre`
  margin-bottom: 5px;
`;

const Badge = styled.div`
  margin: 0;
  padding: 10px;
  width: 100%;
  color: ${PURPLE};
  background-color: ${hexToRGB(PURPLE, 0.2)};
  font-size: 14px;
  border-radius: 6px;
  @media (max-width: 400px) {
    width: 280px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: 320px) {
    width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ::selection {
    color: ${WHITE};
    background-color: ${hexToRGB(PURPLE, 0.5)};
  }
  ::-moz-selection {
    color: ${WHITE};
    background-color: ${hexToRGB(PURPLE, 0.5)};
  }
`;

const Divider = styled.div`
  border: 1px solid ${DARK_GRAY};
  height: 1px;
`;

// =============================================================================
// Typedefs
// =============================================================================

interface Props {
  publicKey: PublicKey | null;
  connectedMethods: ConnectedMethods[];
  connect: () => Promise<void>;
}

// =============================================================================
// Main Component
// =============================================================================

const ConnectRow = React.memo((props: Props) => {
  const { publicKey, connect } = props;

  return (
    <Main>
      <Body>
        {publicKey ? (
          // connected
          <>
            <div>
              <Pre>Connected as</Pre>
              <Badge>{publicKey.toBase58()}</Badge>
              <Divider />
            </div>
          </>
        ) : (
          // not connected
          <Button onClick={connect}>Connect to Phantom</Button>
        )}
      </Body>
    </Main>
  );
});

export default ConnectRow;
