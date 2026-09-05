"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { spawnSync } = require("child_process");
const { plan } = require(path.join(__dirname, "..", "plugins", "zaraat-dost", "scripts", "upgrade.js"));

test("upgrade plan covers marketplace, bundle and every dependency", () => {
  const m = require(path.join(__dirname, "..", "plugins", "zaraat-dost", ".claude-plugin", "plugin.json"));
  const p = plan(m);
  assert.equal(p[0][0], "marketplace");
  assert.equal(p[1][0], "zaraat-dost");
  assert.equal(p.length, 2 + m.dependencies.length);
  for (const d of m.dependencies) assert.ok(p.some(([label]) => label === d.name), d.name);
});
test("upgrade --dry-run runs without claude installed and exits 0", () => {
  const r = spawnSync(process.execPath, [path.join(__dirname, "..", "plugins", "zaraat-dost", "scripts", "upgrade.js"), "--dry-run"], { encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /marketplace/);
  assert.match(r.stdout, /zd-core/);
});
