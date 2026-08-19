#!/usr/bin/env node
// PreToolUse guard for Write/Edit: refuses to write secrets files or content that contains a credential.
// Exit 2 blocks the tool call and returns the stderr message to Claude. Exit 0 allows it.
"use strict";
const fs = require("fs");
const path = require("path");
const P = require(path.join(__dirname, "patterns.js"));

function readInput() { try { return JSON.parse(fs.readFileSync(0, "utf8")); } catch { return {}; } }
function check(filePath, content) {
  const p = (filePath || "").replace(/\\/g, "/");
  if (P.SECRET_PATHS.test(p)) return `refusing to write secrets file ${p}. Create it manually and keep it out of git.`;
  for (const rule of P) {
    const m = rule.re.exec(content || "");
    if (m && !P.PLACEHOLDER.test(m[0])) {
      return `the content for ${p} contains a ${rule.why} (rule ${rule.id}). Move it to an environment variable or secret store and reference it by name.`;
    }
  }
  return null;
}
if (require.main === module) {
  const ti = readInput().tool_input || {};
  const msg = check(ti.file_path, ti.content || ti.new_string || "");
  if (msg) { process.stderr.write(`zd-core guard: ${msg}\n`); process.exit(2); }
  process.exit(0);
}
module.exports = { check };
