"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { spawnSync } = require("child_process");
const { cmp } = require(path.join(__dirname, "..", "plugins", "zaraat-dost", "scripts", "check-update.js"));

test("semver compare", () => {
  assert.ok(cmp("0.5.0", "0.4.9") > 0);
  assert.ok(cmp("1.0.0", "0.99.99") > 0);
  assert.equal(cmp("0.5.0", "0.5.0"), 0);
  assert.ok(cmp("0.5.0", "0.5.1") < 0);
});
test("check-update never fails the session when offline", () => {
  const r = spawnSync(process.execPath, [path.join(__dirname, "..", "plugins", "zaraat-dost", "scripts", "check-update.js")],
    { encoding: "utf8", env: { ...process.env, ZD_PLUGINS_REPO: "invalid/repo-that-does-not-exist", TMPDIR: require("os").tmpdir() }, timeout: 8000 });
  assert.equal(r.status, 0);
  assert.equal(r.stderr, "");
});
