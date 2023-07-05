import * as postgres from "https://deno.land/x/postgres@v0.14.2/mod.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Get the connection string from the environment variable "SUPABASE_DB_URL"

const databaseUrl = Deno.env.get("SUPABASE_DB_URL");

// Create a database pool with three connections that are lazily established
console.log("Creating database pool");
const pool = new postgres.Pool(databaseUrl, 3, true);

serve(async (_req) => {
  try {
    // Grab a connection from the pool
    const connection = await pool.connect();

    try {
      // Run a query
      const result = await connection.queryObject`SELECT * FROM helloworld`;
      const animals = result.rows; // [{ id: 1, name: "Lion" }, ...]

      // Encode the result as pretty printed JSON
      const body = JSON.stringify(animals, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      );

      // Return the response with the correct content type header
      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      });
    } finally {
      // Release the connection back into the pool
      connection.release();
    }
  } catch (err) {
    console.error(err);
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
