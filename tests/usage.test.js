"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs"), os = require("os"), path = require("path");
const { spawnSync } = require("child_process");
const S = path.join(__dirname, "..", "plugins", "zd-usage", "scripts");

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "zd-usage-"));
  const projects = path.join(root, "projects", "-home-adil-AGIS"); fs.mkdirSync(projects, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    { type: "user", timestamp: `${today}T10:00:00Z`, message: { role: "user", content: "hi" } },
    { type: "assistant", timestamp: `${today}T10:00:05Z`, requestId: "r1", message: { id: "m1", model: "claude-sonnet-4-6", usage: { input_tokens: 1000, output_tokens: 200, cache_creation_input_tokens: 500, cache_read_input_tokens: 4000 } } },
    { type: "assistant", timestamp: `${today}T10:00:05Z`, requestId: "r1", message: { id: "m1", model: "claude-sonnet-4-6", usage: { input_tokens: 1000, output_tokens: 200, cache_creation_input_tokens: 500, cache_read_input_tokens: 4000 } } }, // duplicate
    { type: "assistant", timestamp: `2000-01-01T10:00:00Z`, requestId: "r2", message: { id: "m2", model: "claude-fable-5-1", usage: { input_tokens: 10, output_tokens: 10 } } },
  ];
  const t = path.join(projects, "s1.jsonl"); fs.writeFileSync(t, lines.map(l => JSON.stringify(l)).join("\n") + "\n");
  return { root, projectsRoot: path.join(root, "projects"), transcript: t, home: path.join(root, "usage-home") };
}
test("report dedups streamed duplicates and filters by period", () => {
  const f = fixture();
  const env = { ...process.env, CLAUDE_PROJECTS_DIR: f.projectsRoot, ZD_USAGE_HOME: f.home };
  const r = spawnSync(process.execPath, [path.join(S, "usage-report.js"), "week", "--by", "model", "--json"], { encoding: "utf8", env });
  assert.equal(r.status, 0, r.stderr);
  const rows = JSON.parse(r.stdout);
  assert.equal(rows.length, 1); assert.equal(rows[0].key, "claude-sonnet-4-6");
  assert.equal(rows[0].usage.input, 1000); assert.equal(rows[0].usage.messages, 1);
  assert.ok(rows[0].est_usd > 0);
  const all = JSON.parse(spawnSync(process.execPath, [path.join(S, "usage-report.js"), "all", "--by", "model", "--json"], { encoding: "utf8", env }).stdout);
  assert.equal(all.length, 2); assert.equal(all.find(x => x.key === "claude-fable-5-1").est_usd, null, "unpriced model is n/a, not guessed");
});
test("session ledger + budget warning", () => {
  const f = fixture();
  const env = { ...process.env, CLAUDE_PROJECTS_DIR: f.projectsRoot, ZD_USAGE_HOME: f.home };
  const r = spawnSync(process.execPath, [path.join(S, "session-ledger.js")], { encoding: "utf8", env, input: JSON.stringify({ session_id: "s1", transcript_path: f.transcript, cwd: "/home/adil/AGIS", reason: "exit" }) });
  assert.equal(r.status, 0);
  const ledger = fs.readFileSync(path.join(f.home, "ledger.jsonl"), "utf8").trim().split("\n").map(JSON.parse);
  assert.equal(ledger.length, 1); assert.equal(ledger[0].project, "AGIS"); assert.equal(ledger[0].usage.messages, 2);
  const warn = spawnSync(process.execPath, [path.join(S, "budget-check.js")], { encoding: "utf8", env: { ...env, ZD_WEEKLY_TOKEN_BUDGET: "6000" } });
  assert.equal(warn.status, 0); assert.match(warn.stdout, /Usage budget/);
  const quiet = spawnSync(process.execPath, [path.join(S, "budget-check.js")], { encoding: "utf8", env: { ...env, ZD_WEEKLY_TOKEN_BUDGET: "60000000" } });
  assert.equal(quiet.stdout, "");
});
test("malformed values never corrupt totals or hide a session from the budget", () => {
  const f = fixture();
  fs.appendFileSync(f.transcript, JSON.stringify({ type: "assistant", message: { usage: { input_tokens: "x", output_tokens: null } } }) + "\n");
  const env = { ...process.env, CLAUDE_PROJECTS_DIR: f.projectsRoot, ZD_USAGE_HOME: f.home };
  const rows = JSON.parse(spawnSync(process.execPath, [path.join(S, "usage-report.js"), "all", "--json"], { encoding: "utf8", env }).stdout);
  for (const r of rows) for (const v of Object.values(r.usage)) assert.equal(typeof v, "number", "totals stay numeric");
  spawnSync(process.execPath, [path.join(S, "session-ledger.js")], { encoding: "utf8", env, input: JSON.stringify({ transcript_path: f.transcript, cwd: "/home/adil/AGIS" }) });
  const entry = JSON.parse(fs.readFileSync(path.join(f.home, "ledger.jsonl"), "utf8").trim().split("\n").pop());
  assert.match(entry.day, /^\d{4}-\d{2}-\d{2}$/, "a session is always dated, even with malformed lines");
  const warn = spawnSync(process.execPath, [path.join(S, "budget-check.js")], { encoding: "utf8", env: { ...env, ZD_WEEKLY_TOKEN_BUDGET: "1" } });
  assert.match(warn.stdout, /Usage budget/, "the budget check sees the session");
});
test("hooks never fail without input or transcript", () => {
  for (const s of ["session-ledger.js", "budget-check.js"]) {
    const r = spawnSync(process.execPath, [path.join(S, s)], { encoding: "utf8", input: "not json", env: { ...process.env, ZD_USAGE_HOME: fs.mkdtempSync(path.join(os.tmpdir(), "zd-h-")) } });
    assert.equal(r.status, 0, s);
  }
});
test("export + merge produce a per-user team table", () => {
  const f = fixture(); const env = { ...process.env, CLAUDE_PROJECTS_DIR: f.projectsRoot, ZD_USAGE_HOME: f.home };
  const dir = path.join(f.root, "shared");
  for (const u of ["adil", "zayan"]) spawnSync(process.execPath, [path.join(S, "usage-report.js"), "all", "--export", dir, "--user", u], { encoding: "utf8", env });
  const m = spawnSync(process.execPath, [path.join(S, "usage-report.js"), "--merge", dir, "--json"], { encoding: "utf8", env });
  const rows = JSON.parse(m.stdout); assert.equal(rows.length, 2); assert.ok(rows.every(r => r.usage.input === 1010));
});
