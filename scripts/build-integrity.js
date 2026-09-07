#!/usr/bin/env node
// Writes INTEGRITY.json: sha256 of every file that executes or defines behaviour (hook scripts, hooks.json, agents, skills,
// CLI). `zd-tools verify` / /zaraat-dost:verify compare an installed copy against it to detect tampering.
"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const ROOT = path.join(__dirname, "..");
const INCLUDE = /^(plugins\/[^/]+\/(scripts\/.*|hooks\/hooks\.json|agents\/.*\.md|skills\/.*\/SKILL\.md|\.claude-plugin\/plugin\.json)|packages\/zd-tools\/bin\/.*\.js|\.claude-plugin\/marketplace\.json)$/;
function* walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (!["node_modules", ".git", "lib", "dist"].includes(e.name)) yield* walk(f); } else yield f; } }
const files = {};
for (const f of walk(ROOT)) { const rel = path.relative(ROOT, f).replace(/\\/g, "/"); if (INCLUDE.test(rel)) files[rel] = crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex"); }
const version = JSON.parse(fs.readFileSync(path.join(ROOT, "plugins/zaraat-dost/.claude-plugin/plugin.json"))).version;
const out = { version, algorithm: "sha256", files };   // no timestamp: the manifest must be reproducible byte-for-byte
fs.writeFileSync(path.join(ROOT, "INTEGRITY.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`INTEGRITY.json: ${Object.keys(files).length} files at ${version}`);
