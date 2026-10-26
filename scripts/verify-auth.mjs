import { inspectAuth } from '../server/auth-readiness.mjs';
import { exitIfLocalMode } from '../server/local-mode.mjs';

// MODE DATA: verifikasi Auth cloud dilewati HANYA bila DATA_MODE=local.
exitIfLocalMode('scripts/verify-auth.mjs (auth:verify)');
const report = await inspectAuth();
console.log(JSON.stringify(report, null, 2));
// Reachable endpoints are not proof of an OAuth round-trip or admin authorization.
process.exitCode = report.state === 'service_reachable' ? 0 : 1;
