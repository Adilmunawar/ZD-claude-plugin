#!/usr/bin/env node
// Verify the installed toolkit against the published INTEGRITY.json for its version: a modified hook script, agent or skill
// (by malware, a careless edit, or a prompt-injected assistant) shows up as MODIFIED. Exit 1 on any difference.
// Usage: node verify.js [--cache <~/.claude/plugins/cache/zaraatdost>] [--manifest <INTEGRITY.json|url>] [--json]
"use strict";
const fs = require("fs"), os = require("os"), path = require("path"), crypto = require("crypto"), https = require("https");
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const cache = opt("--cache", path.join(os.homedir(), ".claude", "plugins", "cache", "zaraatdost"));
const REPO = process.env.ZD_PLUGINS_REPO || "adilmunawar/ZD-claude-plugin";
function sha(f) { return crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex"); }
function installedVersion() {
  const d = path.join(cache, "zaraat-dost"); const vs = fs.readdirSync(d).filter(v => /^\d+\.\d+\.\d+/.test(v)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return vs.at(-1);
}
function fetch(url) { return new Promise((res, rej) => { https.get(url, { timeout: 8000 }, r => { let b = ""; r.on("data", d => b += d); r.on("end", () => r.statusCode === 200 ? res(b) : rej(new Error(`HTTP ${r.statusCode} for ${url}`))); }).on("error", rej).on("timeout", function () { this.destroy(new Error("timeout")); }); }); }
async function loadManifest(version) {
  const m = opt("--manifest");
  if (m && fs.existsSync(m)) return JSON.parse(fs.readFileSync(m, "utf8"));
  const url = m || `https://raw.githubusercontent.com/${REPO}/v${version}/INTEGRITY.json`;
  return JSON.parse(await fetch(url));
}
(async () => {
  let version; try { version = installedVersion(); } catch { console.error("toolkit is not installed (no cache at " + cache + ")"); process.exit(2); }
  let manifest; try { manifest = await loadManifest(version); } catch (e) { console.error(`could not load INTEGRITY.json for ${version}: ${e.message}`); process.exit(2); }
  const results = { version, checked: 0, ok: 0, modified: [], missing: [], unexpected: [] };
  for (const [rel, expected] of Object.entries(manifest.files)) {
    const m = rel.match(/^plugins\/([^/]+)\/(.*)$/); if (!m) continue;   // marketplace/package files are not in the cache
    const f = path.join(cache, m[1], version, m[2]);
    results.checked++;
    if (!fs.existsSync(f)) { results.missing.push(rel); continue; }
    if (sha(f) !== expected) results.modified.push(rel); else results.ok++;
  }
  // scripts present in the cache that the manifest does not know about
  for (const plugin of fs.readdirSync(cache)) {
    const sd = path.join(cache, plugin, version, "scripts"); if (!fs.existsSync(sd)) continue;
    for (const s of fs.readdirSync(sd)) { const rel = `plugins/${plugin}/scripts/${s}`; if (!(rel in manifest.files)) results.unexpected.push(rel); }
  }
  const bad = results.modified.length + results.missing.length + results.unexpected.length;
  if (args.includes("--json")) console.log(JSON.stringify(results, null, 2));
  else {
    console.log(`zd verify ${version}: ${results.ok}/${results.checked} files match the published manifest`);
    for (const f of results.modified) console.log(`  MODIFIED   ${f}`);
    for (const f of results.missing) console.log(`  MISSING    ${f}`);
    for (const f of results.unexpected) console.log(`  UNEXPECTED ${f}`);
    console.log(bad ? "\nThe installed toolkit differs from the release. Reinstall: claude plugin marketplace update zaraatdost && zd-tools upgrade" : "Installed toolkit is intact.");
  }
  process.exit(bad ? 1 : 0);
})();
