"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { spawnSync } = require("child_process");
const core = path.join(__dirname, "..", "plugins", "zd-core", "scripts");
const bash = require(path.join(core, "guard-bash.js"));
const write = require(path.join(core, "guard-write.js"));

function run(script, input) {
  return spawnSync(process.execPath, [path.join(core, script)], { input: JSON.stringify(input), encoding: "utf8" });
}

test("guard-bash blocks destructive commands", () => {
  const blocked = [
    'psql -c "DROP TABLE parcels"', "TRUNCATE TABLE parcels;", "rm -rf /", "rm -rf ~", "git push origin main --force",
    "git push -f", "git reset --hard HEAD~3", "dotnet ef database drop", "aws s3 rm s3://bucket --recursive", "DELETE FROM parcels;",
  ];
  for (const c of blocked) assert.ok(bash.check(c), `should block: ${c}`);
});
test("guard-bash allows ordinary commands", () => {
  const allowed = [
    "ls -la", "git status", "git push origin main", "rm -rf ./build", "rm -f temp.txt", "npm run typecheck",
    "psql -c \"SELECT count(*) FROM parcels\"", "DELETE FROM parcels WHERE id = 3;", "dotnet ef migrations add Init", "git log --oneline",
  ];
  for (const c of allowed) assert.equal(bash.check(c), null, `should allow: ${c}`);
});
test("guard-bash exit codes", () => {
  assert.equal(run("guard-bash.js", { tool_input: { command: "ls" } }).status, 0);
  const r = run("guard-bash.js", { tool_input: { command: "DROP TABLE x" } });
  assert.equal(r.status, 2); assert.match(r.stderr, /destructive SQL/);
});

test("hook commands are quoted and use only node (Windows-safe)", () => {
  const fs = require("fs"), glob = require("path").join(__dirname, "..", "plugins");
  for (const p of fs.readdirSync(glob)) {
    const h = require("path").join(glob, p, "hooks", "hooks.json"); if (!fs.existsSync(h)) continue;
    for (const entries of Object.values(JSON.parse(fs.readFileSync(h, "utf8")).hooks)) for (const e of entries) for (const hk of e.hooks)
      assert.match(hk.command, /^node "\$\{CLAUDE_PLUGIN_ROOT\}\/scripts\/[a-z-]+\.js"$/, `${p}: ${hk.command}`);
  }
});
test("guard-write refuses secret file paths on any OS", () => {
  for (const p of [".env", ".env.production", "C:\\proj\\gee.json", "keys/agis-ee-key.json", "certs/server.pem", "a/b/service-account.json", "id_rsa"])
    assert.ok(write.check(p, "{}"), `should refuse path: ${p}`);
  assert.equal(write.check(".env.example", "API_BASE=https://example.com"), null);
});
test("guard-write detects credential content", () => {
  const key = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg…";
  assert.ok(write.check("src/x.py", key));
  assert.ok(write.check("src/x.py", 'HF_TOKEN = "hf_' + "A".repeat(34) + '"'));
  assert.ok(write.check("src/x.ts", 'const t = "ghp_' + "b".repeat(36) + '"'));
  assert.ok(write.check("appsettings.json", '"Default": "Server=db;User Id=sa;Password=SuperSecret123;"'));
  assert.ok(write.check("src/x.py", 'api_key = "sk-' + "z".repeat(40) + '"'));
});
test("guard-write enforces the schema posture", () => {
  assert.ok(write.check("apps/api/db/APPLIED_2026-09-07_ZD_Thing_create.sql", "CREATE TABLE ZD_Thing (Id int)"), "change script without XACT_ABORT is refused");
  assert.equal(write.check("apps/api/db/APPLIED_2026-09-07_ZD_Thing_create.sql", "SET XACT_ABORT ON;\nBEGIN TRY\nCREATE TABLE ZD_Thing (Id int)\nEND TRY"), null);
  assert.equal(write.check("apps/api/db/REFERENCE_sp_Thing.sql", "CREATE PROCEDURE dbo.sp_Thing AS SELECT 1"), null, "reference copies are not change scripts");
  assert.ok(write.check("src/Api/Program.cs", "db.Database.Migrate();"), "startup migration is refused");
  assert.equal(write.check("src/Api/Program.cs", "app.MapHealthChecks(\"/health\");"), null);
});
test("guard-bash blocks running database change scripts", () => {
  assert.ok(bash.check("sqlcmd -S localhost -i db/APPLIED_2026-09-07_ZD_Thing_create.sql"));
  assert.ok(bash.check("Invoke-Sqlcmd -InputFile db/ROLLBACK_2026-09-07_ZD_Thing.sql"));
  assert.ok(bash.check("dotnet ef database update"));
  assert.equal(bash.check("sqlcmd -S localhost -Q \"SELECT 1\""), null);
});
test("guard-write allows placeholders and env references", () => {
  assert.equal(write.check("src/x.py", 'HF_TOKEN = os.environ.get("HF_TOKEN")'), null);
  assert.equal(write.check("README.md", 'export HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'), null);
  assert.equal(write.check("src/x.ts", "const t = process.env.HF_TOKEN;"), null);
  assert.equal(write.check("docs.md", 'Password=<your-password>;'), null);
});
test("after-write reminds on vector files only", () => {
  const r1 = run("after-write.js", { tool_input: { file_path: "out/parcels.gpkg" } });
  assert.match(r1.stdout, /geo-data-qa/);
  const r2 = run("after-write.js", { tool_input: { file_path: "src/app.py" } });
  assert.equal(r2.stdout, "");
});
