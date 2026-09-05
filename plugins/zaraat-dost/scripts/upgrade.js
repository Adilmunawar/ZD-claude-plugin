#!/usr/bin/env node
// Upgrade the toolkit: refresh the marketplace, update the bundle, then every module it depends on.
// `claude plugin update` updates one plugin at a time and does not cascade to dependencies, so this loops.
// Usage: node upgrade.js [--marketplace zaraatdost] [--dry-run] [--json]
"use strict";
const fs = require("fs"), path = require("path"), { spawnSync } = require("child_process");
const root = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, "..");
const args = process.argv.slice(2);
const dry = args.includes("--dry-run"), asJson = args.includes("--json");
const mi = args.indexOf("--marketplace"); const MARKET = mi >= 0 ? args[mi + 1] : "zaraatdost";

function manifest() { return JSON.parse(fs.readFileSync(path.join(root, ".claude-plugin", "plugin.json"), "utf8")); }
// After the bundle itself is updated, its new manifest lives in a sibling version directory of the cache; read the newest one
// so dependencies added in the new release are installed too.
function newestManifest() {
  try {
    const versionsDir = path.dirname(root);
    const dirs = fs.readdirSync(versionsDir).filter(d => /^\d+\.\d+\.\d+/.test(d)).sort((a, b) => cmp(b, a));
    for (const d of dirs) { const f = path.join(versionsDir, d, ".claude-plugin", "plugin.json"); if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, "utf8")); }
  } catch {}
  return manifest();
}
function cmp(a, b) { const x = a.split(".").map(Number), y = b.split(".").map(Number); for (let i = 0; i < 3; i++) if ((x[i]||0) !== (y[i]||0)) return (x[i]||0) - (y[i]||0); return 0; }
function claude(cmdArgs) {
  if (dry) return { status: 0, stdout: `[dry-run] claude ${cmdArgs.join(" ")}`, stderr: "" };
  const r = spawnSync("claude", cmdArgs, { encoding: "utf8", shell: process.platform === "win32" });
  return { status: r.status ?? 1, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim() };
}
function deps(m) { return (m.dependencies || []).map(d => (typeof d === "string" ? d : d.name)); }
function plan(m) {
  return [["marketplace", ["plugin", "marketplace", "update", MARKET]], [m.name, ["plugin", "update", `${m.name}@${MARKET}`]],
          ...deps(m).map(d => [d, ["plugin", "update", `${d}@${MARKET}`]])];
}
function step(label, cmdArgs, results) {
  let r = claude(cmdArgs);
  if (r.status !== 0 && /not installed|not found|No plugin/i.test(r.stdout + r.stderr) && cmdArgs[1] === "update") {
    r = claude(["plugin", "install", cmdArgs[2]]); // a dependency added in the new release
    if (r.status === 0) r.stdout += " (installed)";
  }
  const line = (r.stdout + " " + r.stderr).replace(/\s+/g, " ").trim();
  const change = /updated from ([\d.]+) to ([\d.]+)/.exec(line);
  results.push({ step: label, ok: r.status === 0, from: change?.[1], to: change?.[2], note: change ? "updated" : /installed\)/.test(line) ? "installed" : /already|up to date|Successfully/i.test(line) ? "current" : line.slice(0, 160) });
  if (!asJson) console.log(`${r.status === 0 ? "ok " : "ERR"} ${label.padEnd(14)} ${results.at(-1).from ? `${results.at(-1).from} → ${results.at(-1).to}` : results.at(-1).note}`);
}
function main() {
  const m = manifest(); const results = [];
  const first = plan(m).slice(0, 2);
  for (const [label, cmdArgs] of first) step(label, cmdArgs, results);
  const fresh = dry ? m : newestManifest();
  for (const d of deps(fresh)) step(d, ["plugin", "update", `${d}@${MARKET}`], results);
  if (asJson) console.log(JSON.stringify(results, null, 2));
  const failed = results.filter(r => !r.ok).length;
  if (!asJson) console.log(failed ? `\n${failed} step(s) failed.` : "\nDone. Restart Claude Code or run /reload-plugins, then /zaraat-dost:doctor.");
  process.exit(failed ? 1 : 0);
}
if (require.main === module) main();
module.exports = { plan, deps };
