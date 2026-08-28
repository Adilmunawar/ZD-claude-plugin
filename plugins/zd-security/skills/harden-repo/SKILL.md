---
name: harden-repo
disable-model-invocation: true
description: Apply SECURITY.md, Dependabot, secrets-scan workflow, CODEOWNERS and .gitignore baseline; list GitHub settings to enable.
---

1. Copy from `${CLAUDE_PLUGIN_ROOT}/templates/` into the repo (show diff, ask before overwrite): `SECURITY.md`, `.github/dependabot.yml`, `.github/workflows/secrets-scan.yml`, `.github/CODEOWNERS` (fill owners), `.gitignore` additions.
2. Print the GitHub settings to enable (cannot be set from code): branch protection on `main` (require PR, 1 review, status checks `validate` + `secrets-scan`, no force push), secret scanning + push protection, Dependabot alerts, signed commits optional.
3. Run `/zd-core:secrets-audit --history`; if findings, stop and start rotation before anything else.
4. Report what was added and the remaining manual steps.
