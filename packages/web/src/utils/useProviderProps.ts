import { Connection, PublicKey } from "@solana/web3.js";
import { useState, useEffect, useCallback, useMemo } from "react";
import { TLog } from "../types";
import getProvider from "./getProvider";

// =============================================================================
// Constants
// =============================================================================

const NETWORK = "https://api.mainnet-beta.solana.com";
const provider = getProvider();
const connection = new Connection(NETWORK);
const message = "Hello from Phantom!";

// =============================================================================
// Typedefs
// =============================================================================

export type ConnectedMethods =
  | {
      name: string;
      onClick: () => Promise<string | undefined>;
    }
  | {
      name: string;
      onClick: () => Promise<void>;
    };

interface ProviderProps {
  publicKey: PublicKey | null;
  handleConnect: () => Promise<void>;
  handleDisconnect: () => Promise<void>;
}

export const useProviderProps = (): ProviderProps => {
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

  useEffect(() => {
    if (!provider) return;

    provider.on("connect", (publicKey: PublicKey) => {
      console.log("connect event fired", publicKey.toString);
      setPublicKey(publicKey);
    });

    provider.on("accountChanged", (publicKey: PublicKey | null) => {
      console.log("accountChanged event fired", publicKey?.toString());
      setPublicKey(publicKey);
    });

    provider.on("disconnect", () => {
      console.log("disconnect event fired");
      setPublicKey(null);
    });

    return () => {
      provider.disconnect();
    };
  }, []);

  /** Connect */
  const handleConnect = useCallback(async () => {
    if (!provider) return;

    try {
      await provider.connect();
    } catch (error) {
      console.error(error);
    }
  }, []);

  /** Disconnect */
  const handleDisconnect = useCallback(async () => {
    if (!provider) return;

    try {
      await provider.disconnect();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    publicKey,
    handleConnect,
    handleDisconnect,
  };
};
