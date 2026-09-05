#!/usr/bin/env node
// PreToolUse guard for Write/Edit. Refuses to write secrets files or obvious credentials.
const fs = require("fs");
let input = "";
try { input = fs.readFileSync(0, "utf8"); } catch (_) {}
let ti = {};
try { ti = JSON.parse(input).tool_input || {}; } catch (_) {}
const path = (ti.file_path || "").replace(/\\/g, "/");
const content = ti.content || ti.new_string || "";
const secretPath = /(^|\/)(\.env(\..*)?|gee\.json|.*service[-_]?account.*\.json|id_rsa|.*\.pem|.*\.pfx)$/i;
if (secretPath.test(path)) {
  process.stderr.write(`zd-core guard: refusing to write secrets file ${path}. Create it manually and keep it out of git.\n`);
  process.exit(2);
}
const secretContent = /(AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC )?PRIVATE KEY-----|"private_key"\s*:\s*"-----|password\s*=\s*['"][^'"]{8,}['"]|Password=[^;'"\s]{8,};)/;
if (secretContent.test(content)) {
  process.stderr.write(`zd-core guard: the content for ${path} looks like it contains a credential. Move it to environment variables / user-secrets and reference it by name.\n`);
  process.exit(2);
}
process.exit(0);
