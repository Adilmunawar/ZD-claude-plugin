#!/usr/bin/env node
// PreToolUse guard for Bash: blocks clearly destructive commands so Claude has to confirm with the user first.
// Exit 2 blocks the tool call and returns the stderr message to Claude. Exit 0 allows it.
"use strict";
const fs = require("fs");
const RULES = [
  { re: /\brm\s+(-[a-z]*r[a-z]*\s+|-[a-z]*f[a-z]*r[a-z]*\s+)(\/|~|\.\.?\s*$|\*|\$HOME|%USERPROFILE%)/i, why: "recursive delete of a top-level path" },
  { re: /\b(rd|rmdir)\s+\/s\b/i,                                     why: "Windows recursive delete" },
  { re: /\bgit\s+push\b[^|&;]*\s(--force|-f)\b/,                     why: "force push" },
  { re: /\bgit\s+(reset\s+--hard|clean\s+-[a-z]*f|checkout\s+--\s+\.)/, why: "git command that discards work" },
  { re: /\b(drop\s+(table|database|schema|index)|truncate\s+(table\s+)?\w+)\b/i, why: "destructive SQL" },
  { re: /\bdelete\s+from\s+\w+\s*(;|$)/i,                             why: "DELETE without WHERE" },
  { re: /\bdotnet\s+ef\s+database\s+(drop|update)\b/i,               why: "EF Core database drop/update (schema changes are hand-run additive scripts here)" },
  { re: /\b(sqlcmd|invoke-sqlcmd)\b[^|&;]*\b(ROLLBACK|APPLIED|PENDING)_\d{4}-\d{2}-\d{2}/i, why: "running a database change script — needs owner authorization and a DBA at the keyboard" },
  { re: /\bfirebase\s+firestore:delete\b.*(--all-collections|--recursive|-r\b)/i, why: "recursive Firestore delete" },
  { re: /\baws\s+s3\s+(rm|rb)\b.*(--recursive|--force)/i,             why: "recursive S3 delete" },
  { re: /\b(mkfs|dd\s+if=|:\(\)\s*\{\s*:\|:&\s*\};:)/,                why: "disk-level or fork-bomb command" },
  // --- remote code execution: piping downloaded content into a shell
  { re: /\b(curl|wget|irm|iwr|Invoke-WebRequest|Invoke-RestMethod)\b[^|&;]*\|\s*(sudo\s+)?(sh|bash|zsh|pwsh|powershell|iex|python[0-9.]*|node|perl)\b/i, why: "piping downloaded content into an interpreter (remote code execution)" },
  { re: /\b(sh|bash)\s+-c\s+["']?\$\((curl|wget)\b/i,                  why: "executing downloaded content" },
  // --- credential and secret exfiltration
  { re: /\b(cat|type|Get-Content|gc|less|more|head|tail|bat)\b[^|&;]*(\.env(?!\.(?:example|sample|template|dist)\b)(\.[a-z]+)?\b|id_rsa|id_ed25519|\.aws\/credentials|\.netrc|\.npmrc|gee\.json|[a-z-]*service[-_]?account[a-z-]*\.json|[a-z-]*ee-key[a-z-]*\.json|\.pem\b|\.pfx\b)/i, why: "printing a credentials file" },
  { re: /\b(curl|wget|Invoke-RestMethod|Invoke-WebRequest)\b[^|&;]*(-d\s*@|--data(-binary)?\s*@|-F\s*[^ ]*@|--upload-file|-T\s)[^|&;]*(\.env|\.pem|\.pfx|id_rsa|credentials|gee\.json|service[-_]?account)/i, why: "uploading a credentials file" },
  { re: /\b(echo|printf|Write-Output|Write-Host)\b[^|&;]*\$(\{)?(env:)?[A-Z_]*(TOKEN|SECRET|PASSWORD|PASSWD|API_KEY|PRIVATE_KEY|CREDENTIAL)[A-Z_]*\b/i, why: "printing a secret environment variable" },
  { re: /\b(printenv|env|set|Get-ChildItem\s+env:)\b\s*(\||>|$)/i,        why: "dumping the whole environment (contains secrets)" },
  { re: /\b(gcloud\s+iam\s+service-accounts\s+keys\s+create|aws\s+iam\s+create-access-key|gh\s+auth\s+token|firebase\s+login:ci)\b/i, why: "minting a new long-lived credential" },
  // --- persistence and self-protection
  { re: /(>>?|tee\s+(-a\s+)?)\s*[^\s|&;]*(\.bashrc|\.bash_profile|\.profile|\.zshrc|\.zprofile|authorized_keys|\/etc\/(cron|profile|sudoers|hosts)|Microsoft\\Windows\\Start Menu\\Programs\\Startup)/i, why: "writing to a shell startup, cron, sudoers or ssh authorized_keys file (persistence)" },
  { re: /\b(crontab\s+(-e|-r|[^-\s]|-u\s+\S+\s+-e)|schtasks\s+\/create|Register-ScheduledTask|launchctl\s+load|systemctl\s+enable)\b/i, why: "installing a scheduled task or service" },
  { re: /(>>?|tee\s+(-a\s+)?|rm\s+[^|&;]*|mv\s+[^|&;]*|cp\s+[^|&;]*|sed\s+-i[^|&;]*)\s*[^\s|&;]*(\.claude\/(settings|settings\.local|managed-settings)\.json|\.claude\/plugins\/|hooks\/hooks\.json|managed-settings\.json)/i, why: "modifying Claude Code settings, plugin cache or hook definitions (would disable the guardrails)" },
  { re: /\bgit\s+config\b[^|&;]*(credential\.helper|core\.sshCommand|url\.[^ ]*\.insteadof)/i, why: "changing git credential or transport configuration" },
  { re: /\bchmod\s+(-R\s+)?(777|a\+rwx|o\+w)\b/i,                     why: "world-writable permissions" },
  { re: /\b(sudo|doas)\s+(su|-i|-s)\b|\bsudo\s+bash\b/i,               why: "opening a root shell" },
  { re: /\b(npm|pnpm|yarn)\s+publish\b|\btwine\s+upload\b|\bdotnet\s+nuget\s+push\b|\bgh\s+release\s+(create|upload)\b/i, why: "publishing an artefact (releases go through CI)" },
  { re: /\b(Remove-Item|rd|rmdir)\b[^|&;]*(-Recurse|\/s)[^|&;]*(\\|\/)?(Users|Windows|Program Files|home|etc|var|opt)(\\|\/|\s|$)/i, why: "recursive delete of a system or user directory" },
  { re: /\b(format\s+[a-z]:|diskpart|fdisk\s+\/dev)/i,                    why: "disk formatting" },
];
function check(cmd) {
  for (const r of RULES) if (r.re.test(cmd || "")) return r.why;
  return null;
}
if (require.main === module) {
  let cmd = "";
  try { cmd = JSON.parse(fs.readFileSync(0, "utf8")).tool_input?.command || ""; } catch {}
  const why = check(cmd);
  if (why) {
    process.stderr.write(`zd-core guard: blocked ${why}.\nCommand: ${cmd}\nIf intended: confirm a backup exists (pg_dump, _bak_YYYYMMDD copy, or Firestore export), then ask the user to run it themselves or approve it explicitly.\n`);
    process.exit(2);
  }
  process.exit(0);
}
module.exports = { check };
