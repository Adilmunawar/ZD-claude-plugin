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
  if (P.PROTECTED_PATHS.test(p)) return `refusing to modify ${p}: Claude Code settings, plugin caches, hook definitions, shell startup files, ssh keys and CI workflows are changed by people, not by the assistant. Ask the user to make this change.`;
  if (/(^|\/)\.github\/workflows\/[^/]+\.ya?ml$/i.test(p) && /pull_request_target|\$\{\{\s*github\.event\.(issue|pull_request|comment)\.(title|body)/.test(content || "")) {
    return `${p} uses pull_request_target or interpolates untrusted event text into a run step — a classic workflow injection. Use pull_request and pass event data through env vars.`;
  }
  if (/(^|\/)(firestore|database)\.rules$/i.test(p) && /allow\s+(read|write|read,\s*write)\s*:\s*if\s+true\s*;/i.test(content || "")) {
    return `${p} contains an 'allow ... if true' rule — that opens the collection to the internet.`;
  }
  // Database change scripts must carry XACT_ABORT (team schema posture); .NET startup must never migrate.
  if (/(^|\/)db\/(APPLIED|PENDING)_[^/]+\.sql$/i.test(p) && !/SET\s+XACT_ABORT\s+ON/i.test(content || "")) {
    return `${p} is a database change script without SET XACT_ABORT ON. Add it (with TRY/CATCH, guards, verification SELECTs) and a ROLLBACK_ twin.`;
  }
  if (/(^|\/)(Program|Startup)\.cs$/i.test(p) && /\.(Migrate|EnsureCreated|EnsureDeleted)\s*\(/.test(content || "")) {
    return `${p} calls Migrate/EnsureCreated at startup. This team's databases are the contract: schema changes are hand-run additive scripts, never startup migrations.`;
  }
  for (const rule of P) {
    const m = rule.re.exec(content || "");
    if (m && rule.entropy && !(m[1] && P.entropy(m[1]) >= rule.entropy)) continue;   // low-entropy value: not a real secret
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
