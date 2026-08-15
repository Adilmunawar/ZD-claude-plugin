#!/usr/bin/env node
// SessionStart: compare the installed bundle version with the marketplace on GitHub, at most once per day.
// Prints one line only when a newer version exists. Never blocks: 3 s timeout, silent on any failure, offline-safe.
"use strict";
const fs = require("fs"), os = require("os"), path = require("path"), https = require("https");
const REPO = process.env.ZD_PLUGINS_REPO || "adilmunawar/ZD-claude-plugin";
const root = process.env.CLAUDE_PLUGIN_ROOT || path.join(__dirname, "..");
const cache = path.join(os.tmpdir(), "zd-plugins-update-check.json");
const DAY = 24 * 3600 * 1000;

function cmp(a, b) { const x = a.split(".").map(Number), y = b.split(".").map(Number); for (let i = 0; i < 3; i++) { if ((x[i]||0) !== (y[i]||0)) return (x[i]||0) - (y[i]||0); } return 0; }
function installed() { try { return JSON.parse(fs.readFileSync(path.join(root, ".claude-plugin", "plugin.json"), "utf8")).version; } catch { return null; } }
function report(latest, current) {
  if (latest && current && cmp(latest, current) > 0)
    process.stdout.write(`Zaraat Dost toolkit ${latest} is available (installed ${current}). Run /zaraat-dost:upgrade.\n`);
}
function main() {
  const current = installed(); if (!current) return;
  try { const c = JSON.parse(fs.readFileSync(cache, "utf8")); if (Date.now() - c.at < DAY) return report(c.latest, current); } catch {}
  const url = `https://raw.githubusercontent.com/${REPO}/main/plugins/zaraat-dost/.claude-plugin/plugin.json`;
  const req = https.get(url, { timeout: 3000 }, res => {
    let body = ""; res.on("data", d => body += d);
    res.on("end", () => { try { const latest = JSON.parse(body).version; fs.writeFileSync(cache, JSON.stringify({ at: Date.now(), latest })); report(latest, current); } catch {} });
  });
  req.on("timeout", () => req.destroy()); req.on("error", () => {});
}
if (require.main === module) main();
module.exports = { cmp };
