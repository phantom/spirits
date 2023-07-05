import * as postgres from "postgres";
import { ActionsDatabase } from "./types.ts";

export async function insertAction(
  pool: postgres.Pool,
  action: ActionsDatabase
) {
  const connection = await pool.connect();
  try {
    await connection.queryObject`INSERT INTO actions(session_id, pubkey, type, payload, created_at) VALUES (${
      action.session_id
    }, ${action.pubkey}, ${action.type}, ${JSON.stringify(action.payload)}, ${
      action.createdAt
    })`;
  } finally {
    connection.release();
  }
}
