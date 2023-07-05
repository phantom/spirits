import { PublicKey } from "@metaplex-foundation/js";

const PHAMTOM_COLLECTIBLES_URL = "https://api.phantom.app/collectibles/v1";

export async function getCollectiblesByWallet(pubkey: PublicKey) {
  const body = JSON.stringify({
    addresses: [
      {
        chainId: "solana:101",
        address: pubkey.toBase58(),
      },
    ],
  });
  const response = await fetch(PHAMTOM_COLLECTIBLES_URL, {
    body,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
  return response.collectibles;
}
