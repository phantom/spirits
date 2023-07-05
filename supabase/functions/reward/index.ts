import { Application, Router } from "oak";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { getEnvKeypair } from "../utils/keypair.ts";

const router = new Router();
router.get("/reward", (context) => {
  const keypair = getEnvKeypair();
  const connection = new Connection(clusterApiUrl("mainnet-beta"));

  context.response.body = { data: "Rewards" };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
