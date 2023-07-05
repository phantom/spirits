import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

/**
 * @returns returns a Keypair from the local env titled PHANTOM_NFT_MINTING_5Sq8.
 */
const AIRDROPPER_PK = Deno.env.get("AIRDROPPER_PK");

export const getEnvKeypair = () => {
  const secretKey = AIRDROPPER_PK ?? "";

  try {
    return Keypair.fromSecretKey(bs58.decode(secretKey));
  } catch {
    // ignore
  }

  try {
    const buffer = Buffer.from(secretKey, "hex");
    return Keypair.fromSecretKey(buffer);
  } catch {
    // ignore
  }

  try {
    const buffer = Buffer.from(secretKey, "base64");
    return Keypair.fromSecretKey(buffer);
  } catch {
    // ignore
  }

  throw new Error(
    "Unable to create keypair from PHANTOM_NFT_MINTING_5Sq8 environment variable."
  );
};
