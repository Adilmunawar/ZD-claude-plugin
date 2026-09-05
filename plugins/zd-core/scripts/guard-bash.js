#!/usr/bin/env node
// PreToolUse guard for Bash. Blocks (exit 2) clearly destructive commands and asks Claude to confirm with the user.
// Node is always present where Claude Code runs, so this works on Windows, macOS and Linux.
const fs = require("fs");
let input = "";
try { input = fs.readFileSync(0, "utf8"); } catch (_) {}
let cmd = "";
try { cmd = JSON.parse(input).tool_input?.command || ""; } catch (_) {}
const c = cmd.toLowerCase();
const rules = [
  [/\brm\s+-[a-z]*r[a-z]*f?\s+(\/|~|\.|\*)/, "recursive delete of a top-level path"],
  [/\bgit\s+push\b.*(--force|-f)\b/, "force push"],
  [/\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f)/, "history/working-tree destroying git command"],
  [/\b(drop\s+(table|database|schema)|truncate\s+table)\b/, "destructive SQL"],
  [/\bdelete\s+from\s+\w+\s*;?\s*$/, "DELETE without WHERE"],
  [/\bdotnet\s+ef\s+database\s+drop\b/, "EF Core database drop"],
  [/\b(mkfs|dd\s+if=|:\(\)\s*\{)/, "disk-level or fork-bomb command"],
];
for (const [re, why] of rules) {
  if (re.test(c)) {
    process.stderr.write(`zd-core guard: blocked ${why}.\nCommand: ${cmd}\nIf this is intended: confirm a backup exists (_bak_YYYYMMDD copy or pg_dump), then ask the user to run it manually or re-run with explicit approval in the conversation.\n`);
    process.exit(2);
  }
}
process.exit(0);
