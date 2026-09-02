#!/usr/bin/env node
// Copies the plugin scripts into packages/zd-tools/lib so the npm package ships the same code the plugins run.
// Run by `npm pack`/`npm publish` (prepack) and by scripts/validate.sh.
"use strict";
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, ".."), LIB = path.join(ROOT, "packages", "zd-tools", "lib");
const SRC = {
  "plugins/zd-core/scripts": ["patterns.js", "secrets-audit.js", "guard-bash.js", "guard-write.js"],
  "plugins/zd-usage/scripts": ["lib.js", "usage-report.js", "budget-check.js"],
  "plugins/zaraat-dost/scripts": ["upgrade.js"],
};
fs.rmSync(LIB, { recursive: true, force: true }); fs.mkdirSync(path.join(LIB, "plugin-root", ".claude-plugin"), { recursive: true });
for (const [dir, files] of Object.entries(SRC)) for (const f of files) fs.copyFileSync(path.join(ROOT, dir, f), path.join(LIB, f));
// upgrade.js reads the bundle manifest relative to CLAUDE_PLUGIN_ROOT; ship a copy so `zd-tools upgrade` knows the module list.
fs.copyFileSync(path.join(ROOT, "plugins/zaraat-dost/.claude-plugin/plugin.json"), path.join(LIB, "plugin-root", ".claude-plugin", "plugin.json"));
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "packages/zd-tools/package.json"), "utf8"));
const bundle = JSON.parse(fs.readFileSync(path.join(ROOT, "plugins/zaraat-dost/.claude-plugin/plugin.json"), "utf8"));
if (pkg.version !== bundle.version) { console.error(`package version ${pkg.version} != bundle version ${bundle.version}`); process.exit(1); }
console.log(`built packages/zd-tools/lib (${Object.values(SRC).flat().length} files) at ${pkg.version}`);
