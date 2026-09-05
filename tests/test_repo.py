"""Structural tests for the marketplace: every plugin resolves, frontmatter is valid, dependencies exist, docs are current."""
import json, os, re, subprocess, sys, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def frontmatter(path):
    text = open(path, encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    assert m, f"{path}: missing frontmatter"
    return dict(l.split(":", 1) for l in m.group(1).splitlines() if ":" in l)

def test_marketplace_entries_resolve():
    m = json.load(open(f"{ROOT}/.claude-plugin/marketplace.json"))
    names = set()
    for p in m["plugins"]:
        src = os.path.join(ROOT, p["source"])
        assert os.path.isdir(src), p["name"]
        pj = json.load(open(f"{src}/.claude-plugin/plugin.json"))
        assert pj["name"] == p["name"]
        names.add(p["name"])
    for p in m["plugins"]:
        pj = json.load(open(f"{ROOT}/{p['source']}/.claude-plugin/plugin.json"))
        for dep in pj.get("dependencies", []):
            dn = dep["name"] if isinstance(dep, dict) else dep
            assert dn in names, f"{p['name']} depends on unknown {dn}"

def test_versions_aligned():
    vers = {json.load(open(f))["name"]: json.load(open(f))["version"] for f in glob.glob(f"{ROOT}/plugins/*/.claude-plugin/plugin.json")}
    vers["@adilmunawar/zd-tools"] = json.load(open(f"{ROOT}/packages/zd-tools/package.json"))["version"]
    assert len(set(vers.values())) == 1, vers

def test_skills_and_agents_frontmatter():
    for f in glob.glob(f"{ROOT}/plugins/*/skills/*/SKILL.md"):
        fm = frontmatter(f); assert fm["name"].strip() == os.path.basename(os.path.dirname(f)), f
        assert len(fm["description"].strip()) > 40, f
    for f in glob.glob(f"{ROOT}/plugins/*/agents/*.md"):
        fm = frontmatter(f); assert fm["name"].strip() == os.path.basename(f)[:-3], f
        assert "tools" in fm and "description" in fm, f

def test_hooks_json_valid_and_scripts_exist():
    for h in glob.glob(f"{ROOT}/plugins/*/hooks/hooks.json"):
        d = json.load(open(h)); plugin = os.path.dirname(os.path.dirname(h))
        for event, entries in d["hooks"].items():
            for e in entries:
                for hk in e["hooks"]:
                    script = re.search(r'\$\{CLAUDE_PLUGIN_ROOT\}/(\S+?)"', hk["command"]).group(1)
                    assert os.path.exists(os.path.join(plugin, script)), script

def test_no_internal_secrets_or_names():
    bad = re.compile(r"hf_[A-Za-z0-9]{30,}|ghp_[A-Za-z0-9]{36}|BEGIN PRIVATE KEY|agis-\d{6}|aoserv\.com", re.I)
    for f in glob.glob(f"{ROOT}/**/*", recursive=True):
        rel = os.path.relpath(f, ROOT)
        if rel.startswith(("tests/", "packages/zd-tools/lib/", "packages/zd-tools/node_modules/")) or rel.endswith("patterns.js") or rel.endswith(".zip"):
            continue  # test fixtures and the detection patterns legitimately contain the shapes
        if os.path.isfile(f) and ".git/" not in f:
            txt = open(f, encoding="utf-8", errors="ignore").read()
            assert not bad.search(txt), f

def test_command_skills_have_hints_and_fork_skills_have_tools():
    for f in glob.glob(f"{ROOT}/plugins/*/skills/*/SKILL.md"):
        fm = frontmatter(f)
        if fm.get("context", "").strip() == "fork":
            assert "allowed-tools" in fm, f"{f}: forked skill needs allowed-tools"
        if "paths" in fm:
            assert fm["paths"].strip().startswith("[") and fm["paths"].strip().endswith("]"), f"{f}: paths must be a YAML list"
            assert "disable-model-invocation" not in fm, f"{f}: paths only makes sense for auto-activated skills"

def test_docs_current():
    r = subprocess.run([sys.executable, f"{ROOT}/scripts/gen-docs.py", "--check"], capture_output=True, text=True)
    assert r.returncode == 0, r.stdout + r.stderr
