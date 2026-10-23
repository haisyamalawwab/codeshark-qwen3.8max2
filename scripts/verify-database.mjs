import { createDatabaseStatusService } from "../server/database-status.mjs";
import { closeTidbPool } from "../server/tidb.mjs";

try {
  const report = await createDatabaseStatusService()();
  console.log(JSON.stringify(report, null, 2)); // Fixed key names/statuses; no values.
  process.exitCode = report.syncPrerequisitesReady ? 0 : 1;
} catch {
  console.error("Verification failed. No credentials or driver errors are printed.");
  process.exitCode = 1;
} finally {
  await closeTidbPool();
}
