// Shared usage-accounting helpers. Reads Claude Code transcripts (~/.claude/projects/**/*.jsonl) and the local ledger.
// No dependencies. Pricing is configurable; unknown models report tokens with cost "n/a" rather than a guess.
"use strict";
const fs = require("fs"), os = require("os"), path = require("path");

const HOME = process.env.ZD_USAGE_HOME || path.join(os.homedir(), ".claude", "zd-usage");
const LEDGER = path.join(HOME, "ledger.jsonl");
const BUDGET = path.join(HOME, "budget.json");
const PROJECTS = process.env.CLAUDE_PROJECTS_DIR || path.join(os.homedir(), ".claude", "projects");
// USD per million tokens: [input, output, cache_write, cache_read]. Override with ZD_PRICING_FILE (same shape).
const DEFAULT_PRICING = {
  "claude-opus-4":   [15, 75, 18.75, 1.5],
  "claude-sonnet-4": [3, 15, 3.75, 0.3],
  "claude-haiku-4":  [1, 5, 1.25, 0.1],
};
function pricing() {
  if (process.env.ZD_PRICING_FILE) { try { return { ...DEFAULT_PRICING, ...JSON.parse(fs.readFileSync(process.env.ZD_PRICING_FILE, "utf8")) }; } catch {} }
  return DEFAULT_PRICING;
}
function priceFor(model, table) {
  const m = (model || "").toLowerCase();
  const key = Object.keys(table).sort((a, b) => b.length - a.length).find(k => m.startsWith(k.toLowerCase()));
  return key ? table[key] : null;
}
function cost(u, model, table) {
  const p = priceFor(model, table); if (!p) return null;
  return (u.input * p[0] + u.output * p[1] + u.cache_write * p[2] + u.cache_read * p[3]) / 1e6;
}
function zero() { return { input: 0, output: 0, cache_write: 0, cache_read: 0, messages: 0 }; }
function add(a, b) { a.input += b.input; a.output += b.output; a.cache_write += b.cache_write; a.cache_read += b.cache_read; a.messages += b.messages; return a; }
function total(u) { return u.input + u.output + u.cache_write + u.cache_read; }

/** Parse one transcript file into per-(day, model) usage. Deduplicates streamed duplicates by message id + request id. */
function parseTranscript(file) {
  const out = new Map(); const seen = new Set();
  let text; try { text = fs.readFileSync(file, "utf8"); } catch { return out; }
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    let e; try { e = JSON.parse(line); } catch { continue; }
    const msg = e.message; const u = msg && msg.usage; if (!u) continue;
    const id = (msg.id || "") + ":" + (e.requestId || e.request_id || ""); if (id !== ":" && seen.has(id)) continue; seen.add(id);
    const day = (e.timestamp || "").slice(0, 10) || "unknown"; const model = msg.model || "unknown";
    const k = day + "\u0000" + model; if (!out.has(k)) out.set(k, { day, model, usage: zero() });
    add(out.get(k).usage, { input: u.input_tokens || 0, output: u.output_tokens || 0, cache_write: u.cache_creation_input_tokens || 0, cache_read: u.cache_read_input_tokens || 0, messages: 1 });
  }
  return out;
}
function projectNameFromDir(dir) {
  // Claude Code encodes the project path: /home/a/proj -> -home-a-proj ; C:\Users\a\proj -> C--Users-a-proj
  let n = path.basename(dir).replace(/^([A-Za-z])--/, "$1:/").replace(/^-+/, "").replace(/-/g, "/");
  return n.split("/").filter(Boolean).slice(-2).join("/") || n;   // last two segments: enough to recognise, short enough to tabulate
}
/** Scan all transcripts. Returns rows {project, day, model, usage}. */
function scanTranscripts(root = PROJECTS) {
  const rows = [];
  let dirs = []; try { dirs = fs.readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => path.join(root, d.name)); } catch { return rows; }
  for (const dir of dirs) {
    const project = projectNameFromDir(dir);
    let files = []; try { files = fs.readdirSync(dir).filter(f => f.endsWith(".jsonl")).map(f => path.join(dir, f)); } catch { continue; }
    for (const f of files) for (const r of parseTranscript(f).values()) rows.push({ project, ...r });
  }
  return rows;
}
function readLedger() {
  let text; try { text = fs.readFileSync(LEDGER, "utf8"); } catch { return []; }
  return text.split("\n").filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}
function appendLedger(entry) { fs.mkdirSync(HOME, { recursive: true }); fs.appendFileSync(LEDGER, JSON.stringify(entry) + "\n"); }
function readBudget() { try { return JSON.parse(fs.readFileSync(BUDGET, "utf8")); } catch { return {}; } }
function writeBudget(b) { fs.mkdirSync(HOME, { recursive: true }); fs.writeFileSync(BUDGET, JSON.stringify(b, null, 2) + "\n"); }
function isoWeek(day) { // YYYY-Www
  const d = new Date(day + "T00:00:00Z"); if (isNaN(d)) return "unknown";
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); const dow = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dow);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); const wk = Math.ceil(((t - y0) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(wk).padStart(2, "0")}`;
}
function fmt(n) { return n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "k" : String(n); }
module.exports = { HOME, LEDGER, BUDGET, PROJECTS, pricing, priceFor, cost, zero, add, total, parseTranscript, scanTranscripts, readLedger, appendLedger, readBudget, writeBudget, isoWeek, fmt };
