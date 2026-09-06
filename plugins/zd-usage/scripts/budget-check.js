#!/usr/bin/env node
// SessionStart hook: one line when this week's usage (from the ledger) crosses 80% or 100% of the configured budget. Silent otherwise.
"use strict";
const path = require("path");
const L = require(path.join(__dirname, "lib.js"));
try {
  const b = L.readBudget(); const weekly = L.num(process.env.ZD_WEEKLY_TOKEN_BUDGET || b.weekly_tokens || 0); if (!weekly) process.exit(0);
  const wk = L.isoWeek(new Date().toISOString().slice(0, 10));
  let used = 0; for (const e of L.readLedger()) if (L.isoWeek(e.day) === wk) used += L.total(e.usage);
  const pct = used / weekly * 100;
  if (pct >= 100) process.stdout.write(`Usage budget: ${L.fmt(used)} of ${L.fmt(weekly)} tokens this week (${pct.toFixed(0)}%) — over budget. Prefer smaller scopes and /zd-usage:report to see where it went.\n`);
  else if (pct >= 80) process.stdout.write(`Usage budget: ${pct.toFixed(0)}% of this week's ${L.fmt(weekly)} tokens used.\n`);
} catch {}
process.exit(0);
