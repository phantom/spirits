import { Application, Router } from "oak";
import { ActionsRequest } from "./types.ts";
import { insertAction } from "./database.ts";
import * as postgres from "postgres";

// Database pool
const databaseUrl = Deno.env.get("SUPABASE_DB_URL");
const pool = new postgres.Pool(databaseUrl, 3, true);

const router = new Router();
router.post("/actions", async (context) => {
  const payload: ActionsRequest = await context.request.body().value;
  const createdAt = new Date().toISOString();
  console.log(payload);
  try {
    await insertAction(pool, { ...payload, createdAt });
  } catch (err) {
    console.error(err);
    context.response.status = 500;
    context.response.body = { error: err.message };
  }
  context.response.body = { recorded: true };
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
