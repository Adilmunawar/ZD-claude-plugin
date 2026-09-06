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

def test_environment_assumptions():
    """Things that broke on a real Windows machine or would: shorthand marketplace sources, exit under iex, unquoted plugin paths."""
    for f in ["README.md", "docs/INSTALL.md", "install.sh", "install.ps1", "plugins/zaraat-dost/README.md"]:
        txt = open(f"{ROOT}/{f}", encoding="utf-8").read()
        assert "marketplace add Adilmunawar/ZD-claude-plugin" not in txt, f"{f}: use the HTTPS URL, owner/repo shorthand may resolve to SSH"
    for f in glob.glob(f"{ROOT}/**/*.md", recursive=True):
        if "/node_modules/" in f: continue
        txt = open(f, encoding="utf-8").read()
        for m in re.finditer(r"(?:npx|npm i(?:nstall)?(?: -g)?) @adilmunawar/zd-tools(?!.*not on npmjs)", txt):
            line = txt[:m.start()].count("\n") + 1
            ctx = txt[max(0, m.start()-600):m.start()]
            assert "GitHub Packages" in ctx or "Method 2" in ctx or "not on npmjs" in ctx, f"{f}:{line}: bare npmjs-style install implies the package is on npmjs; show the release-tarball command or label it GitHub Packages"
    for f in ["install.sh", "install.ps1", "plugins/zaraat-dost/scripts/upgrade.js"]:
        assert "--yes" not in open(f"{ROOT}/{f}", encoding="utf-8").read(), f"{f}: --yes is not supported by Claude Code < 2.1.23x and is not needed"
    ps1 = open(f"{ROOT}/install.ps1", encoding="utf-8").read()
    assert not re.search(r"^\s*exit\b", ps1, re.M), "install.ps1 must not call exit (closes the window under iex)"
    for f in glob.glob(f"{ROOT}/plugins/**/*.md", recursive=True) + glob.glob(f"{ROOT}/plugins/*/hooks/hooks.json"):
        txt = open(f, encoding="utf-8").read()
        assert not re.search(r'node\s+\$\{CLAUDE_PLUGIN_ROOT\}', txt), f"{f}: node ${{CLAUDE_PLUGIN_ROOT}}/... must be double-quoted (paths with spaces)"
    for f in glob.glob(f"{ROOT}/templates/**/*.json", recursive=True):
        d = json.load(open(f))
        for name, m in (d.get("extraKnownMarketplaces") or {}).items():
            s = m["source"]; assert s["source"] in ("git", "url") and s.get("url", "").startswith("https://"), f"{f}: marketplace {name} must use an https git url"

def test_workflows_are_valid():
    """A workflow that fails to parse shows up as a red run with no jobs; catch it before pushing."""
    try:
        import yaml
    except ImportError:
        return  # optional locally; CI installs it
    import subprocess, tempfile
    for wf in glob.glob(f"{ROOT}/.github/workflows/*.yml"):
        d = yaml.safe_load(open(wf))
        assert d and "jobs" in d, f"{wf}: no jobs"
        for job in d["jobs"].values():
            for step in job.get("steps", []):
                assert "secrets." not in str(step.get("if", "")), f"{wf}: the secrets context is not available in `if`"
                if "run" in step and (step.get("shell") in (None, "bash")):
                    with tempfile.NamedTemporaryFile("w", suffix=".sh", delete=False) as fh:
                        fh.write(step["run"]); path = fh.name
                    r = subprocess.run(["bash", "-n", path], capture_output=True, text=True)
                    assert r.returncode == 0, f"{wf} step {step.get('name')}: {r.stderr}"

def test_docs_current():
    r = subprocess.run([sys.executable, f"{ROOT}/scripts/gen-docs.py", "--check"], capture_output=True, text=True)
    assert r.returncode == 0, r.stdout + r.stderr
