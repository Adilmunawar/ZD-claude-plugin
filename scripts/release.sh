#!/usr/bin/env bash
# Prepare a release: bump every manifest, check the changelog, validate, and print the exact tag commands.
# Usage: bash scripts/release.sh 7.4.0
set -euo pipefail
cd "$(dirname "$0")/.."
V="${1:-}"; [ -n "$V" ] || { echo "usage: bash scripts/release.sh <X.Y.Z>"; exit 1; }
case "$V" in *.*.*) ;; *) echo "version must be X.Y.Z"; exit 1;; esac
[ -z "$(git status --porcelain)" ] || { echo "working tree is dirty — commit or stash first"; exit 1; }

node -e '
const fs=require("fs"), v=process.argv[1];
for (const d of fs.readdirSync("plugins")) {
  const p=`plugins/${d}/.claude-plugin/plugin.json`, j=JSON.parse(fs.readFileSync(p));
  j.version=v; if (j.dependencies) j.dependencies=j.dependencies.map(x=>({name:x.name,version:"^"+v}));
  fs.writeFileSync(p, JSON.stringify(j,null,2)+"\n");
}
for (const p of [".claude-plugin/marketplace.json","packages/zd-tools/package.json"]) {
  const j=JSON.parse(fs.readFileSync(p)); j.version=v; fs.writeFileSync(p, JSON.stringify(j,null,2)+"\n");
}
console.log("bumped every manifest to", v);
' "$V"

grep -q "^## $V " CHANGELOG.md || {
  echo
  echo "CHANGELOG.md needs a section before you tag. Add at the top:"
  echo
  echo "## $V — $(date +%Y-%m-%d)"
  echo
  echo "Added / Changed / Fixed"
  echo "- ..."
  echo
  exit 1
}

python3 scripts/gen-docs.py >/dev/null
bash scripts/validate.sh

echo
echo "Ready. Review the diff, then:"
echo "  git add -A && git commit -m \"chore(release): v$V\""
echo "  git push"
echo "  git tag v$V && git push origin v$V"
echo
echo "The release workflow validates, verifies the assets install and run, publishes the package and creates the release."
