#!/usr/bin/env node
// Scan a repository for committed credentials: working tree, and optionally full git history.
// Usage: node secrets-audit.js [dir] [--history] [--json] [--ignore=dir1,dir2]
// Exit code 1 when findings exist, so it can gate CI.
"use strict";
const fs = require("fs"), path = require("path"), { execSync } = require("child_process");
const P = require(path.join(__dirname, "patterns.js"));
const SKIP_DIRS = new Set([".git", "node_modules", ".venv", "venv", "__pycache__", "bin", "obj", "dist", "build", ".next", "tile_cache", "tiles_cache"]);
const MAX_BYTES = 2 * 1024 * 1024;

function* walk(dir, ignore) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name) && !ignore.has(e.name)) yield* walk(path.join(dir, e.name), ignore); }
    else if (e.isFile()) yield path.join(dir, e.name);
  }
}
function scanText(text, file, findings, where) {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    for (const rule of P) {
      const m = rule.re.exec(lines[i]);
      if (m && !P.PLACEHOLDER.test(m[0])) findings.push({ file, line: i + 1, rule: rule.id, why: rule.why, where, sample: m[0].slice(0, 12) + "…" });
    }
  }
}
function audit(root, opts = {}) {
  const findings = [];
  const ignore = new Set(opts.ignore || []);
  for (const f of walk(root, ignore)) {
    const rel = path.relative(root, f).replace(/\\/g, "/");
    if (P.SECRET_PATHS.test(rel)) findings.push({ file: rel, line: 0, rule: "secret-file", why: "secrets file tracked in repo", where: "tree", sample: "" });
    let st; try { st = fs.statSync(f); } catch { continue; }
    if (st.size > MAX_BYTES) continue;
    let txt; try { txt = fs.readFileSync(f, "utf8"); } catch { continue; }
    if (txt.includes("\u0000")) continue;
    scanText(txt, rel, findings, "tree");
  }
  if (opts.history) {
    let log = "";
    try { log = execSync("git log -p --all --no-color --diff-filter=A", { cwd: root, encoding: "utf8", maxBuffer: 512 * 1024 * 1024 }); } catch { log = ""; }
    let file = "history";
    for (const line of log.split("\n")) {
      if (line.startsWith("+++ b/")) { file = line.slice(6); continue; }
      if ([...ignore].some(d => file === d || file.startsWith(d + "/"))) continue;
      if (!line.startsWith("+") || line.startsWith("+++")) continue;
      scanText(line.slice(1), file, findings, "history");
    }
  }
  return findings;
}
if (require.main === module) {
  const args = process.argv.slice(2);
  const root = path.resolve(args.find(a => !a.startsWith("--")) || ".");
  const ignore = (args.find(a => a.startsWith("--ignore=")) || "").slice(9).split(",").filter(Boolean);
  const findings = audit(root, { history: args.includes("--history"), ignore });
  if (args.includes("--json")) { console.log(JSON.stringify(findings, null, 2)); }
  else if (!findings.length) { console.log("secrets-audit: no findings"); }
  else {
    console.log(`secrets-audit: ${findings.length} finding(s)\n`);
    for (const f of findings) console.log(`${f.where.padEnd(7)} ${f.file}:${f.line}  ${f.rule}  (${f.why})`);
    console.log("\nRotate every credential listed above. Deleting the file does not revoke it, and history keeps it.");
  }
  process.exit(findings.length ? 1 : 0);
}
module.exports = { audit };
