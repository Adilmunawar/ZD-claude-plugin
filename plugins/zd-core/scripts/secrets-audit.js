#!/usr/bin/env node
// Scan a repository for committed credentials: working tree, and optionally full git history.
// Usage: node secrets-audit.js [dir] [--history] [--json] [--ignore=dir1,dir2]
// Exit code 1 when findings exist, so it can gate CI.
"use strict";
const fs = require("fs"), path = require("path"), { execSync } = require("child_process");
const P = require(path.join(__dirname, "patterns.js"));
const SKIP_DIRS = new Set([".git", "node_modules", ".venv", "venv", "__pycache__", "bin", "obj", "dist", "build", ".next", "tile_cache", "tiles_cache"]);
const MAX_BYTES = Number(process.env.ZD_AUDIT_MAX_BYTES || 20 * 1024 * 1024);  // files above this are reported as skipped, never silently ignored
const MAX_LINE = 4096;   // scanning is line-based; a minified bundle on one line is still checked in chunks

function* walk(dir, ignore, seen = new Set()) {
  let real; try { real = fs.realpathSync(dir); } catch { return; }
  if (seen.has(real)) return;            // symlink loops
  seen.add(real);
  let entries; try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    let isDir = e.isDirectory(), isFile = e.isFile();
    if (e.isSymbolicLink()) {            // follow symlinks: a linked directory can hold secrets too
      try { const st = fs.statSync(full); isDir = st.isDirectory(); isFile = st.isFile(); } catch { continue; }
    }
    if (isDir) { if (!SKIP_DIRS.has(e.name) && !ignore.has(e.name)) yield* walk(full, ignore, seen); }
    else if (isFile) yield full;
  }
}
function scanText(text, file, findings, where) {
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    // very long lines (minified bundles, base64 blobs) are scanned in overlapping chunks so a match is never split
    const chunks = lines[i].length > MAX_LINE
      ? Array.from({ length: Math.ceil(lines[i].length / MAX_LINE) }, (_, k) => lines[i].slice(k * MAX_LINE, (k + 1) * MAX_LINE + 200))
      : [lines[i]];
    const seenOnLine = new Set();   // chunks overlap, so the same rule can match twice on one line
    for (const chunk of chunks) {
      for (const rule of P) {
        const m = rule.re.exec(chunk);
        if (m && !P.PLACEHOLDER.test(m[0]) && !seenOnLine.has(rule.id)) {
          seenOnLine.add(rule.id);
          findings.push({ file, line: i + 1, rule: rule.id, why: rule.why, where, sample: m[0].slice(0, 12) + "…" });
        }
      }
    }
  }
}
function audit(root, opts = {}) {
  const findings = [];
  const skipped = [];
  const ignore = new Set(opts.ignore || []);
  for (const f of walk(root, ignore)) {
    const rel = path.relative(root, f).replace(/\\/g, "/");
    if (P.SECRET_PATHS.test(rel)) findings.push({ file: rel, line: 0, rule: "secret-file", why: "secrets file tracked in repo", where: "tree", sample: "" });
    let st; try { st = fs.statSync(f); } catch { continue; }
    if (st.size > MAX_BYTES) { skipped.push({ file: rel, size: st.size }); continue; }
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
  findings.skipped = skipped;
  return findings;
}
if (require.main === module) {
  const args = process.argv.slice(2);
  const root = path.resolve(args.find(a => !a.startsWith("--")) || ".");
  const ignore = (args.find(a => a.startsWith("--ignore=")) || "").slice(9).split(",").filter(Boolean);
  const findings = audit(root, { history: args.includes("--history"), ignore });
  if (args.includes("--json")) { console.log(JSON.stringify({ findings, skipped: findings.skipped || [] }, null, 2)); }
  else if (!findings.length) { console.log("secrets-audit: no findings"); }
  else {
    console.log(`secrets-audit: ${findings.length} finding(s)\n`);
    for (const f of findings) console.log(`${f.where.padEnd(7)} ${f.file}:${f.line}  ${f.rule}  (${f.why})`);
    console.log("\nRotate every credential listed above. Deleting the file does not revoke it, and history keeps it.");
  }
  if (findings.skipped && findings.skipped.length && !args.includes("--json")) {
    console.log(`\n${findings.skipped.length} file(s) larger than ${(MAX_BYTES / 1048576).toFixed(0)} MB were not scanned:`);
    for (const s of findings.skipped.slice(0, 10)) console.log(`  ${s.file} (${(s.size / 1048576).toFixed(1)} MB)`);
    console.log("  Raise the limit with ZD_AUDIT_MAX_BYTES if these could contain credentials.");
  }
  process.exit(findings.length ? 1 : 0);
}
module.exports = { audit };
