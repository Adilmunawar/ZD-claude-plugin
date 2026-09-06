"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs"), os = require("os"), path = require("path");
const { audit } = require(path.join(__dirname, "..", "plugins", "zd-core", "scripts", "secrets-audit.js"));

function tmpRepo(files) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "zd-audit-"));
  for (const [p, c] of Object.entries(files)) { fs.mkdirSync(path.dirname(path.join(d, p)), { recursive: true }); fs.writeFileSync(path.join(d, p), c); }
  return d;
}
test("finds embedded service-account key, HF token and secret file", () => {
  const d = tmpRepo({
    "Xgboost/agis-ee-key.json": '{"type":"service_account","private_key":"-----BEGIN PRIVATE KEY-----\\nABC"}',
    "train.py": 'HF_TOKEN = "hf_' + "Q".repeat(34) + '"\nprint(1)\n',
    "node_modules/pkg/x.js": 'const k = "ghp_' + "c".repeat(36) + '";',
    "README.md": "Set HF_TOKEN in your environment.\n",
  });
  const f = audit(d);
  const rules = f.map(x => x.rule).sort();
  assert.ok(rules.includes("secret-file"));
  assert.ok(rules.includes("gcp-service-account"));
  assert.ok(rules.includes("huggingface-token"));
  assert.ok(!f.some(x => x.file.startsWith("node_modules/")), "node_modules skipped");
  assert.ok(!f.some(x => x.file === "README.md"));
});
test("--ignore applies to git history as well as the working tree", () => {
  const { execSync } = require("child_process");
  const d = tmpRepo({ "tests/fixture.js": 'const k = "hf_' + "Z".repeat(34) + '";', "app.py": "print(1)\n" });
  execSync("git init -q -b main && git add . && git -c user.name=t -c user.email=t@t commit -q -m fixture", { cwd: d });
  assert.ok(audit(d, { history: true }).length > 0, "fixture is found when nothing is ignored");
  assert.equal(audit(d, { history: true, ignore: ["tests"] }).length, 0, "ignored directory is skipped in history too");
});
test("scans large files, follows symlinked directories, survives symlink loops", () => {
  const big = "a".repeat(3 * 1024 * 1024) + "\nhf_" + "Q".repeat(34) + "\n";
  const d = tmpRepo({ "big.py": big, "ok.txt": "nothing here" });
  assert.ok(audit(d).some(f => f.file === "big.py"), "a secret in a 3 MB file must be found");

  const target = tmpRepo({ "t.py": 'k = "hf_' + "Q".repeat(34) + '"' });
  const host = fs.mkdtempSync(path.join(os.tmpdir(), "zd-sym-"));
  fs.symlinkSync(target, path.join(host, "linked"), "dir");
  assert.ok(audit(host).some(f => f.file.startsWith("linked/")), "a symlinked directory must be scanned");

  fs.symlinkSync(host, path.join(host, "loop"), "dir");
  const t0 = Date.now(); audit(host);
  assert.ok(Date.now() - t0 < 10000, "a symlink loop must not hang the scan");
});
test("files above the size cap are reported, never silently skipped", () => {
  const d = tmpRepo({ "huge.log": "x".repeat(1024) });
  const prev = process.env.ZD_AUDIT_MAX_BYTES;
  const { execFileSync } = require("child_process");
  const out = execFileSync(process.execPath, [path.join(__dirname, "..", "plugins", "zd-core", "scripts", "secrets-audit.js"), d],
    { encoding: "utf8", env: { ...process.env, ZD_AUDIT_MAX_BYTES: "100" } });
  assert.match(out, /were not scanned/);
  assert.match(out, /huge\.log/);
  if (prev === undefined) delete process.env.ZD_AUDIT_MAX_BYTES;
});
test("a credential inside a very long single line is still found", () => {
  const d = tmpRepo({ "bundle.min.js": "x".repeat(50000) + 'const t="hf_' + "Z".repeat(34) + '";' + "y".repeat(50000) });
  assert.ok(audit(d).some(f => f.rule === "huggingface-token"), "long lines are scanned in chunks");
});
test("clean repo yields no findings", () => {
  const d = tmpRepo({ "app.py": 'import os\nTOKEN = os.environ["HF_TOKEN"]\n', ".env.example": "HF_TOKEN=\n" });
  assert.equal(audit(d).length, 0);
});
