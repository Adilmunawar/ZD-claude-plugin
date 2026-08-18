#!/usr/bin/env node
// PreToolUse guard for Bash: blocks clearly destructive commands so Claude has to confirm with the user first.
// Exit 2 blocks the tool call and returns the stderr message to Claude. Exit 0 allows it.
"use strict";
const fs = require("fs");
const RULES = [
  { re: /\brm\s+(-[a-z]*r[a-z]*\s+|-[a-z]*f[a-z]*r[a-z]*\s+)(\/|~|\.\.?\s*$|\*|\$HOME|%USERPROFILE%)/i, why: "recursive delete of a top-level path" },
  { re: /\b(rd|rmdir)\s+\/s\b/i,                                     why: "Windows recursive delete" },
  { re: /\bgit\s+push\b[^|&;]*\s(--force|-f)\b/,                     why: "force push" },
  { re: /\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f|checkout\s+--\s+\.)/, why: "git command that discards work" },
  { re: /\b(drop\s+(table|database|schema|index)|truncate\s+(table\s+)?\w+)\b/i, why: "destructive SQL" },
  { re: /\bdelete\s+from\s+\w+\s*(;|$)/i,                             why: "DELETE without WHERE" },
  { re: /\bdotnet\s+ef\s+database\s+drop\b/i,                        why: "EF Core database drop" },
  { re: /\bfirebase\s+firestore:delete\b.*(--all-collections|--recursive|-r\b)/i, why: "recursive Firestore delete" },
  { re: /\baws\s+s3\s+(rm|rb)\b.*(--recursive|--force)/i,             why: "recursive S3 delete" },
  { re: /\b(mkfs|dd\s+if=|:\(\)\s*\{\s*:\|:&\s*\};:)/,                why: "disk-level or fork-bomb command" },
];
function check(cmd) {
  for (const r of RULES) if (r.re.test(cmd || "")) return r.why;
  return null;
}
if (require.main === module) {
  let cmd = "";
  try { cmd = JSON.parse(fs.readFileSync(0, "utf8")).tool_input?.command || ""; } catch {}
  const why = check(cmd);
  if (why) {
    process.stderr.write(`zd-core guard: blocked ${why}.\nCommand: ${cmd}\nIf intended: confirm a backup exists (pg_dump, _bak_YYYYMMDD copy, or Firestore export), then ask the user to run it themselves or approve it explicitly.\n`);
    process.exit(2);
  }
  process.exit(0);
}
module.exports = { check };
