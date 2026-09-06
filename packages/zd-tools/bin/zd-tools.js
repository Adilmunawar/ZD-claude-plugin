#!/usr/bin/env node
// zd-tools: the toolkit's standalone commands. Same scripts the Claude Code plugins use, packaged for CI and terminals.
"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const PKG = path.join(__dirname, "..");
const REPO = path.join(PKG, "..", "..");            // present when installed from the git repository
const LIB = path.join(PKG, "lib");                  // present in the published tarball
// Where each script lives in the repository, used when the packed lib/ is absent.
const IN_REPO = {
  "secrets-audit.js": "plugins/zd-core/scripts/secrets-audit.js",
  "guard-bash.js": "plugins/zd-core/scripts/guard-bash.js",
  "guard-write.js": "plugins/zd-core/scripts/guard-write.js",
  "usage-report.js": "plugins/zd-usage/scripts/usage-report.js",
  "budget-check.js": "plugins/zd-usage/scripts/budget-check.js",
  "upgrade.js": "plugins/zaraat-dost/scripts/upgrade.js",
};
function resolveScript(file) {
  const packed = path.join(LIB, file);
  if (fs.existsSync(packed)) return packed;
  const inRepo = path.join(REPO, IN_REPO[file] || "");
  if (IN_REPO[file] && fs.existsSync(inRepo)) return inRepo;
  console.error(`zd-tools: cannot find ${file}. Reinstall the package.`);
  process.exit(1);
}
const COMMANDS = {
  "secrets-audit": ["secrets-audit.js", "Scan a repository for committed credentials (tree, and git history with --history). Exit 1 on findings."],
  "usage":         ["usage-report.js",  "Claude Code usage by project/model/day/week from local transcripts; --export / --merge for teams."],
  "budget-check":  ["budget-check.js",  "Print a warning when this week's usage exceeds 80% / 100% of ZD_WEEKLY_TOKEN_BUDGET."],
  "upgrade":       ["upgrade.js",       "Update the zaraat-dost marketplace, bundle and every module (needs the claude CLI)."],
  "guard-bash":    ["guard-bash.js",    "Stdin JSON {tool_input:{command}} → exit 2 if destructive. For custom hook setups."],
  "guard-write":   ["guard-write.js",   "Stdin JSON {tool_input:{file_path,content}} → exit 2 if it looks like a credential."],
};
function version() {
  for (const p of [path.join(PKG, "package.json"), path.join(REPO, "package.json")]) {
    try { return JSON.parse(fs.readFileSync(p, "utf8")).version; } catch {}
  }
  return "unknown";
}
function help() {
  const v = version();
  console.log(`zd-tools ${v}\n\nUsage: zd-tools <command> [args]\n`);
  for (const [k, [, d]] of Object.entries(COMMANDS)) console.log(`  ${k.padEnd(14)} ${d}`);
  console.log(`\nExamples:\n  zd-tools secrets-audit . --history\n  zd-tools usage week --by project\n  zd-tools usage all --export ./shared --user adil\n\nDocs: https://github.com/Adilmunawar/ZD-claude-plugin`);
}
const [cmd, ...rest] = process.argv.slice(2);
if (!cmd || cmd === "--help" || cmd === "-h") { help(); process.exit(0); }
if (cmd === "--version" || cmd === "-v") { console.log(version()); process.exit(0); }
if (!COMMANDS[cmd]) { console.error(`unknown command: ${cmd}\n`); help(); process.exit(2); }
const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT
  || (fs.existsSync(path.join(LIB, "plugin-root")) ? path.join(LIB, "plugin-root") : path.join(REPO, "plugins", "zaraat-dost"));
const env = { ...process.env, CLAUDE_PLUGIN_ROOT: pluginRoot };
const r = spawnSync(process.execPath, [resolveScript(COMMANDS[cmd][0]), ...rest], { stdio: "inherit", env });
process.exit(r.status ?? 1);
