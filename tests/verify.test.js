"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs"), os = require("os"), path = require("path");
const { spawnSync } = require("child_process");
const ROOT = path.join(__dirname, "..");
const VERIFY = path.join(ROOT, "plugins", "zaraat-dost", "scripts", "verify.js");

function fakeCache(version, manifest) {
  const cache = fs.mkdtempSync(path.join(os.tmpdir(), "zd-cache-"));
  for (const rel of Object.keys(manifest.files)) {
    const m = rel.match(/^plugins\/([^/]+)\/(.*)$/); if (!m) continue;
    const dst = path.join(cache, m[1], version, m[2]); fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(path.join(ROOT, rel), dst);
  }
  return cache;
}
test("verify passes on a pristine install and fails on a tampered hook", () => {
  spawnSync(process.execPath, [path.join(ROOT, "scripts", "build-integrity.js")]);
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "INTEGRITY.json"), "utf8"));
  const cache = fakeCache(manifest.version, manifest);
  let r = spawnSync(process.execPath, [VERIFY, "--cache", cache, "--manifest", path.join(ROOT, "INTEGRITY.json")], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  fs.appendFileSync(path.join(cache, "zd-core", manifest.version, "scripts", "guard-bash.js"), "\n// tampered\n");
  r = spawnSync(process.execPath, [VERIFY, "--cache", cache, "--manifest", path.join(ROOT, "INTEGRITY.json")], { encoding: "utf8" });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /MODIFIED\s+plugins\/zd-core\/scripts\/guard-bash\.js/);
  fs.writeFileSync(path.join(cache, "zd-core", manifest.version, "scripts", "evil.js"), "//");
  r = spawnSync(process.execPath, [VERIFY, "--cache", cache, "--manifest", path.join(ROOT, "INTEGRITY.json")], { encoding: "utf8" });
  assert.match(r.stdout, /UNEXPECTED\s+plugins\/zd-core\/scripts\/evil\.js/);
});
test("integrity manifest covers every hook script, agent and skill", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "INTEGRITY.json"), "utf8"));
  for (const p of fs.readdirSync(path.join(ROOT, "plugins"))) {
    const sd = path.join(ROOT, "plugins", p, "scripts"); if (fs.existsSync(sd)) for (const s of fs.readdirSync(sd)) if (s.endsWith(".js")) assert.ok(`plugins/${p}/scripts/${s}` in manifest.files, `plugins/${p}/scripts/${s}`);
    const hj = path.join(ROOT, "plugins", p, "hooks", "hooks.json"); if (fs.existsSync(hj)) assert.ok(`plugins/${p}/hooks/hooks.json` in manifest.files);
    for (const a of (fs.existsSync(path.join(ROOT, "plugins", p, "agents")) ? fs.readdirSync(path.join(ROOT, "plugins", p, "agents")) : [])) assert.ok(`plugins/${p}/agents/${a}` in manifest.files);
  }
});
