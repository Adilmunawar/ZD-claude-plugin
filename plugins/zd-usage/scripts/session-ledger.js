#!/usr/bin/env node
// SessionEnd hook: summarise this session's transcript into the local ledger (one JSON line per session).
// Never blocks or fails the session. Nothing leaves the machine.
"use strict";
const fs = require("fs"), path = require("path");
const L = require(path.join(__dirname, "lib.js"));
let input = {}; try { input = JSON.parse(fs.readFileSync(0, "utf8")); } catch {}
try {
  const t = input.transcript_path; if (!t || !fs.existsSync(t)) process.exit(0);
  const per = L.parseTranscript(t); const table = L.pricing();
  const models = {}; const usage = L.zero(); let est = 0, priced = true, day = null;
  for (const r of per.values()) { models[r.model] = L.add(models[r.model] || L.zero(), r.usage); L.add(usage, r.usage); const c = L.cost(r.usage, r.model, table); if (c === null) priced = false; else est += c; day = day || r.day; }
  if (!usage.messages) process.exit(0);
  L.appendLedger({ ended: new Date().toISOString(), day: day || new Date().toISOString().slice(0, 10), session_id: input.session_id || null, cwd: input.cwd || process.cwd(),
    project: path.basename(input.cwd || process.cwd()), usage, models, est_usd: priced ? +est.toFixed(4) : null, reason: input.reason || null });
} catch {}
process.exit(0);
