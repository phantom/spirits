import * as postgres from "postgres";
import { SweepstakesDatabaseObj, SweepstakesObj } from "./types.ts";

export async function insertSweepstakes(
  pool: postgres.Pool,
  pubkey: string,
  sweepstakes: SweepstakesObj
) {
  const connection = await pool.connect();
  try {
    await connection.queryObject`INSERT INTO sweepstakes(pubkey, sweepstakes, expiration) VALUES (${pubkey}, ${sweepstakes}, ${sweepstakes.expiration})`;
  } finally {
    connection.release();
  }
}

export async function lookupSweepstakes(
  pool: postgres.Pool,
  pubkey: string
): Promise<SweepstakesDatabaseObj[]> {
  const connection = await pool.connect();
  try {
    const result =
      await connection.queryObject`SELECT * FROM sweepstakes WHERE pubkey = ${pubkey}`;

    return result.rows as SweepstakesDatabaseObj[];
  } finally {
    connection.release();
  }
}

export async function deleteSweepstakes(pool: postgres.Pool, pubkey: string) {
  const connection = await pool.connect();
  try {
    await connection.queryObject`DELETE FROM sweepstakes WHERE pubkey = ${pubkey}`;
  } finally {
    connection.release();
  }
}
