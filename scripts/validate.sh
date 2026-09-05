#!/usr/bin/env bash
# Validate marketplace + plugin manifests and frontmatter. Requires: python3.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "== marketplace.json"; python3 -c "import json,sys; d=json.load(open('.claude-plugin/marketplace.json')); assert all(k in d for k in ('name','owner','plugins')), 'missing required key'" && echo ok
for p in plugins/*/; do
  echo "== $p"
  python3 -c "import json; d=json.load(open('$p/.claude-plugin/plugin.json')); assert 'name' in d" && echo "plugin.json ok"
  [ -f "$p/hooks/hooks.json" ] && python3 -c "import json; json.load(open('$p/hooks/hooks.json'))" && echo "hooks.json ok"
  for s in "$p"scripts/*.js; do [ -f "$s" ] && node --check "$s" && echo "  $s syntax ok"; done
  for f in "$p"agents/*.md "$p"skills/*/SKILL.md "$p"output-styles/*.md; do
    [ -f "$f" ] || continue
    head -1 "$f" | grep -q '^---$' || { echo "FAIL: $f missing frontmatter"; exit 1; }
    grep -q '^description:' "$f" || { echo "FAIL: $f missing description"; exit 1; }
    echo "  $f ok"
  done
done
if command -v claude >/dev/null; then claude plugin validate .; else echo "(claude CLI not found; skipped deep validation)"; fi
