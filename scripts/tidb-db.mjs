import { readFile } from "node:fs/promises";
import { getTidbPool, closeTidbPool } from "../server/tidb.mjs";

const command = process.argv[2];
if (!["init", "check"].includes(command)) {
  console.error("Usage: node --env-file-if-exists=.env scripts/tidb-db.mjs init|check");
  process.exitCode = 1;
} else {
  try {
    const pool = getTidbPool();
    if (command === "init") {
      const source = await readFile(new URL("../db/tidb-schema.sql", import.meta.url), "utf8");
      // This initial schema has no routines or semicolons within literals.
      const statements = source.replace(/^\s*--.*$/gm, "").split(";").map((s) => s.trim()).filter(Boolean);
      for (const sql of statements) await pool.query(sql);
      console.log("TiDB schema initialized (001_initial_tidb). DDL is idempotent, not transactional.");
    }
    const [[server]] = await pool.query("SELECT VERSION() AS version, DATABASE() AS db, UTC_TIMESTAMP() AS utc_time");
    const [tables] = await pool.query("SHOW TABLES LIKE 'cs\\_%'");
    const names = tables.map((row) => Object.values(row)[0]);
    const required = ["cs_schema_migrations", "cs_profiles", "cs_saves", "cs_attempts"];
    if (required.some((name) => !names.includes(name))) throw new Error("Schema is incomplete; run db:tidb:init");
    console.log(JSON.stringify({ ...server, tables: names }, null, 2));
  } catch (error) {
    // Do not print connection strings, credentials, or full database errors.
    console.error("TiDB command failed. Check server env, TLS CA, network access, schema and database permissions.");
    console.error(`Error code: ${error.code || "CONFIG_OR_CONNECTION_ERROR"}`);
    process.exitCode = 1;
  } finally {
    await closeTidbPool();
  }
}
