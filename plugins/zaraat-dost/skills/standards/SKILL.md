---
name: standards
disable-model-invocation: true
description: Apply team repository standards (.editorconfig, .gitattributes, pre-commit, VS Code, PR template, code of conduct) with diffs before writing.
effort: low
---

1. Compare each file in `templates/repo-standards/` (in the toolkit repository, or fetch from GitHub) with the repo; show diffs; write on approval. Never overwrite a customised file silently.
2. Install pre-commit if `.pre-commit-config.yaml` was added (`pip install pre-commit && pre-commit install`).
3. Run `/zd-security:harden-repo` and `/zd-core:onboard` if not done.
4. Report files added/changed and the remaining manual GitHub settings.
