/* eslint-env node */
/* global console, process */
/* eslint no-console: 0 */

import { execSync } from "node:child_process";

console.log("🔍 Running dependency audit...");
try {
  execSync("npm audit --audit-level=high", { stdio: "inherit" });
  console.log("✅ Audit complete.");
} catch {
  console.error("⚠️  Some vulnerabilities found.");
  process.exit(1);
}
