#!/usr/bin/env bash
# Run everything CI runs, locally, before you push. Mirrors .github/workflows/*.yml.
# Usage: bash scripts/ci-local.sh [--release]     (--release also builds and verifies the release assets)
set -uo pipefail
cd "$(dirname "$0")/.."
PASS=0; FAIL=0; SKIP=0
step() { printf "%-58s" "$1"; shift; if out=$("$@" 2>&1); then echo "PASS"; PASS=$((PASS+1)); else echo "FAIL"; FAIL=$((FAIL+1)); echo "$out" | tail -6 | sed 's/^/    | /'; fi; }
skip() { printf "%-58s%s\n" "$1" "SKIP ($2)"; SKIP=$((SKIP+1)); }
have() { command -v "$1" >/dev/null 2>&1; }

echo "== validate workflow: validate job"
step "manifests, hooks, tests, docs, official validator" bash scripts/validate.sh
step "secrets audit (tree + history)" node plugins/zd-core/scripts/secrets-audit.js . --history --ignore=tests,packages

echo
echo "== validate workflow: cross-platform job"
step "node tests" node --test tests/hooks.test.js tests/secrets-audit.test.js tests/usage.test.js tests/upgrade.test.js tests/check-update.test.js
step "package builds" node scripts/build-package.js
step "package runs" node packages/zd-tools/bin/zd-tools.js --version
if have pwsh; then step "PowerShell installer parses" pwsh -NoProfile -Command '$null = [scriptblock]::Create((Get-Content -Raw install.ps1))'
else skip "PowerShell installer parses" "pwsh not installed"; fi

echo
echo "== release workflow (dry run)"
V=$(node -p "require('./plugins/zaraat-dost/.claude-plugin/plugin.json').version")
printf "%-58s" "every manifest at $V"
if node -e '
const fs=require("fs"),g=require("path");let v=new Set();
for(const d of fs.readdirSync("plugins")) v.add(require(process.cwd()+"/plugins/"+d+"/.claude-plugin/plugin.json").version);
v.add(require(process.cwd()+"/.claude-plugin/marketplace.json").version);
v.add(require(process.cwd()+"/packages/zd-tools/package.json").version);
process.exit(v.size===1?0:1)'; then echo "PASS"; PASS=$((PASS+1)); else echo "FAIL"; FAIL=$((FAIL+1)); fi
printf "%-58s" "CHANGELOG has a section for $V"
if grep -q "^## $V " CHANGELOG.md; then echo "PASS"; PASS=$((PASS+1)); else echo "FAIL (add '## $V — $(date +%F)')"; FAIL=$((FAIL+1)); fi

if [ "${1:-}" = "--release" ]; then
  echo
  echo "== release assets (built and verified as CI does)"
  rm -rf dist && mkdir -p dist
  step "build archive" bash -c "git archive --format=zip --prefix=ZD-claude-plugin-$V/ -o dist/ZD-claude-plugin-$V.zip HEAD"
  step "build package tarball" bash -c "cd packages/zd-tools && npm pack --silent && mv ./*.tgz ../../dist/"
  step "checksums" bash -c "cd dist && sha256sum ./* > SHA256SUMS.txt"
  if have claude; then step "archive passes claude plugin validate" bash -c "cd dist && unzip -qo ZD-claude-plugin-$V.zip && claude plugin validate ZD-claude-plugin-$V && rm -rf ZD-claude-plugin-$V"
  else skip "archive passes claude plugin validate" "claude CLI not installed"; fi
  step "tarball installs and runs" bash -c 'd=$(mktemp -d); cd "$d"; npm init -y >/dev/null; npm i --silent "'"$PWD"'/dist/adilmunawar-zd-tools-'"$V"'.tgz"; [ "$(npx zd-tools --version)" = "'"$V"'" ]'
fi

echo
echo "----------------------------------------------------------"
echo "$PASS passed, $FAIL failed, $SKIP skipped"
[ "$FAIL" -eq 0 ] && echo "Safe to push." || echo "Fix the failures above before pushing."
exit $([ "$FAIL" -eq 0 ] && echo 0 || echo 1)
