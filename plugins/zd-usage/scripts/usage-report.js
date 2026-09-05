#!/usr/bin/env node
// Usage report from Claude Code transcripts (complete) or the ledger (fast).
// Usage: node usage-report.js [today|week|month|all|--since YYYY-MM-DD] [--by project|model|day|week] [--source transcripts|ledger]
//        [--json] [--csv] [--export <dir>] [--merge <dir>] [--user <name>]
// Plan limits (5-hour window, weekly cap) are shown by Claude Code's built-in /usage; this tool covers history, projects and teams.
"use strict";
const fs = require("fs"), os = require("os"), path = require("path");
const L = require(path.join(__dirname, "lib.js"));

function parseArgs(argv) {
  const a = { period: "week", by: "project", source: "transcripts", json: false, csv: false, export: null, merge: null, user: os.userInfo().username, since: null };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (["today", "week", "month", "all"].includes(x)) a.period = x;
    else if (x === "--since") a.since = argv[++i];
    else if (x === "--by") a.by = argv[++i];
    else if (x === "--source") a.source = argv[++i];
    else if (x === "--json") a.json = true; else if (x === "--csv") a.csv = true;
    else if (x === "--export") a.export = argv[++i]; else if (x === "--merge") a.merge = argv[++i]; else if (x === "--user") a.user = argv[++i];
  }
  return a;
}
function inPeriod(day, a) {
  if (a.since) return day >= a.since;
  const today = new Date().toISOString().slice(0, 10);
  if (a.period === "today") return day === today;
  if (a.period === "all") return true;
  const d = new Date(today + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() - (a.period === "week" ? 6 : 29));
  return day >= d.toISOString().slice(0, 10);
}
function rows(a) {
  if (a.source === "ledger") return L.readLedger().flatMap(e => Object.entries(e.models || {}).map(([model, usage]) => ({ project: e.project, day: e.day, model, usage })));
  return L.scanTranscripts();
}
function group(rs, by) {
  const g = new Map();
  for (const r of rs) {
    const key = by === "model" ? r.model : by === "day" ? r.day : by === "week" ? L.isoWeek(r.day) : r.project;
    if (!g.has(key)) g.set(key, { key, usage: L.zero(), models: {} });
    const e = g.get(key); L.add(e.usage, r.usage); e.models[r.model] = L.add(e.models[r.model] || L.zero(), r.usage);
  }
  return [...g.values()].sort((x, y) => L.total(y.usage) - L.total(x.usage));
}
function withCost(entries, table) {
  return entries.map(e => { let c = 0, priced = true; for (const [m, u] of Object.entries(e.models)) { const x = L.cost(u, m, table); if (x === null) priced = false; else c += x; } return { ...e, est_usd: priced ? +c.toFixed(2) : null }; });
}
function table(entries, by) {
  const head = [by, "total", "input", "output", "cache w", "cache r", "msgs", "est USD"];
  const lines = [head.join("\t")];
  for (const e of entries) lines.push([e.key, L.fmt(L.total(e.usage)), L.fmt(e.usage.input), L.fmt(e.usage.output), L.fmt(e.usage.cache_write), L.fmt(e.usage.cache_read), e.usage.messages, e.est_usd === null ? "n/a" : e.est_usd.toFixed(2)].join("\t"));
  const sum = entries.reduce((s, e) => L.add(s, e.usage), L.zero()); const c = entries.every(e => e.est_usd !== null) ? entries.reduce((s, e) => s + e.est_usd, 0) : null;
  lines.push(["TOTAL", L.fmt(L.total(sum)), L.fmt(sum.input), L.fmt(sum.output), L.fmt(sum.cache_write), L.fmt(sum.cache_read), sum.messages, c === null ? "n/a" : c.toFixed(2)].join("\t"));
  return lines.join("\n");
}
function csv(entries, by, user) {
  const h = ["user", by, "total", "input", "output", "cache_write", "cache_read", "messages", "est_usd"];
  return [h.join(","), ...entries.map(e => [user, e.key, L.total(e.usage), e.usage.input, e.usage.output, e.usage.cache_write, e.usage.cache_read, e.usage.messages, e.est_usd ?? ""].join(","))].join("\n") + "\n";
}
function mergeDir(dir) {
  const acc = new Map();
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".csv"))) {
    const [h, ...ls] = fs.readFileSync(path.join(dir, f), "utf8").trim().split("\n"); const cols = h.split(",");
    for (const l of ls) { const v = l.split(","); const rec = Object.fromEntries(cols.map((c, i) => [c, v[i]])); const k = rec.user; if (!acc.has(k)) acc.set(k, { key: k, usage: L.zero(), models: {}, est_usd: 0, priced: true });
      const e = acc.get(k); L.add(e.usage, { input: +rec.input, output: +rec.output, cache_write: +rec.cache_write, cache_read: +rec.cache_read, messages: +rec.messages }); if (rec.est_usd === "") e.priced = false; else e.est_usd += +rec.est_usd; }
  }
  return [...acc.values()].map(e => ({ ...e, est_usd: e.priced ? +e.est_usd.toFixed(2) : null })).sort((x, y) => L.total(y.usage) - L.total(x.usage));
}
function main() {
  const a = parseArgs(process.argv.slice(2)); const pt = L.pricing();
  if (a.merge) { const m = mergeDir(a.merge); console.log(a.json ? JSON.stringify(m, null, 2) : table(m, "user")); return; }
  const rs = rows(a).filter(r => inPeriod(r.day, a));
  const entries = withCost(group(rs, a.by), pt);
  if (a.export) { fs.mkdirSync(a.export, { recursive: true }); const f = path.join(a.export, `usage-${a.user}-${a.period}-${new Date().toISOString().slice(0, 10)}.csv`); fs.writeFileSync(f, csv(entries, a.by, a.user)); console.log(`wrote ${f}`); return; }
  if (a.json) console.log(JSON.stringify(entries, null, 2));
  else if (a.csv) process.stdout.write(csv(entries, a.by, a.user));
  else { console.log(`Claude usage — ${a.since ? "since " + a.since : a.period} — by ${a.by} — source: ${a.source}${rs.length ? "" : " (no data found)"}`); console.log(table(entries, a.by)); console.log(`\nCost is an estimate from a public price table (${Object.keys(pt).join(", ")}); "n/a" means an unpriced model. Plan limits: run /usage in Claude Code.`); }
}
if (require.main === module) main();
module.exports = { parseArgs, inPeriod, group, withCost, table, csv, mergeDir };
