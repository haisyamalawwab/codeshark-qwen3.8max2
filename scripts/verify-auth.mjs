import { inspectAuth } from '../server/auth-readiness.mjs';
const report = await inspectAuth();
console.log(JSON.stringify(report, null, 2));
// Reachable endpoints are not proof of an OAuth round-trip or admin authorization.
process.exitCode = report.state === 'service_reachable' ? 0 : 1;
