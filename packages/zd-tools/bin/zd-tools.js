#!/usr/bin/env node
// zd-tools: the toolkit's standalone commands. Same scripts the Claude Code plugins use, packaged for CI and terminals.
"use strict";
const path = require("path");
const { spawnSync } = require("child_process");
const LIB = path.join(__dirname, "..", "lib");
const COMMANDS = {
  "secrets-audit": ["secrets-audit.js", "Scan a repository for committed credentials (tree, and git history with --history). Exit 1 on findings."],
  "usage":         ["usage-report.js",  "Claude Code usage by project/model/day/week from local transcripts; --export / --merge for teams."],
  "budget-check":  ["budget-check.js",  "Print a warning when this week's usage exceeds 80% / 100% of ZD_WEEKLY_TOKEN_BUDGET."],
  "upgrade":       ["upgrade.js",       "Update the zaraat-dost marketplace, bundle and every module (needs the claude CLI)."],
  "guard-bash":    ["guard-bash.js",    "Stdin JSON {tool_input:{command}} → exit 2 if destructive. For custom hook setups."],
  "guard-write":   ["guard-write.js",   "Stdin JSON {tool_input:{file_path,content}} → exit 2 if it looks like a credential."],
};
function help() {
  const v = require("../package.json").version;
  console.log(`zd-tools ${v}\n\nUsage: zd-tools <command> [args]\n`);
  for (const [k, [, d]] of Object.entries(COMMANDS)) console.log(`  ${k.padEnd(14)} ${d}`);
  console.log(`\nExamples:\n  zd-tools secrets-audit . --history\n  zd-tools usage week --by project\n  zd-tools usage all --export ./shared --user adil\n\nDocs: https://github.com/Adilmunawar/ZD-claude-plugin`);
}
const [cmd, ...rest] = process.argv.slice(2);
if (!cmd || cmd === "--help" || cmd === "-h") { help(); process.exit(0); }
if (cmd === "--version" || cmd === "-v") { console.log(require("../package.json").version); process.exit(0); }
if (!COMMANDS[cmd]) { console.error(`unknown command: ${cmd}\n`); help(); process.exit(2); }
const env = { ...process.env, CLAUDE_PLUGIN_ROOT: process.env.CLAUDE_PLUGIN_ROOT || path.join(LIB, "plugin-root") };
const r = spawnSync(process.execPath, [path.join(LIB, COMMANDS[cmd][0]), ...rest], { stdio: "inherit", env });
process.exit(r.status ?? 1);
