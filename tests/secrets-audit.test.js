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
test("clean repo yields no findings", () => {
  const d = tmpRepo({ "app.py": 'import os\nTOKEN = os.environ["HF_TOKEN"]\n', ".env.example": "HF_TOKEN=\n" });
  assert.equal(audit(d).length, 0);
});
