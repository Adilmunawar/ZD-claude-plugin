#!/usr/bin/env bash
# Local validation: manifests, frontmatter, hook syntax, unit tests, docs drift. Requires node >= 18 and python3.
set -euo pipefail
cd "$(dirname "$0")/.."
PY=$(command -v python3 || command -v python) || { echo "python3/python not found"; exit 1; }
echo "== manifests"
$PY -c "import json,glob; json.load(open('.claude-plugin/marketplace.json')); [json.load(open(f)) for f in glob.glob('plugins/*/.claude-plugin/plugin.json')]; print('ok')"
echo "== hook script syntax"
for s in plugins/*/scripts/*.js; do node --check "$s"; done && echo ok
echo "== python syntax"
$PY -m py_compile plugins/zd-vector/scripts/raster_to_polygons.py scripts/gen-docs.py && echo ok
echo "== node tests"
node --test tests/*.test.js
echo "== python tests"
if $PY -c "import pytest" 2>/dev/null; then $PY -m pytest -q tests/; else $PY -c "
import importlib.util,sys; spec=importlib.util.spec_from_file_location('t','tests/test_repo.py'); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
[getattr(m,n)() for n in dir(m) if n.startswith('test_')]; print('ok (pytest not installed; ran directly)')"; fi
echo "== npm package"
node scripts/build-package.js && node packages/zd-tools/bin/zd-tools.js --version >/dev/null && echo ok
echo "== upgrade plan (dry run)"
node plugins/zaraat-dost/scripts/upgrade.js --dry-run >/dev/null && echo ok
echo "== docs"
$PY scripts/gen-docs.py --check && echo ok
if command -v claude >/dev/null 2>&1; then echo "== claude plugin validate"; claude plugin validate .; fi
