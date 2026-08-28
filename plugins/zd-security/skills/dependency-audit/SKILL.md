---
name: dependency-audit
disable-model-invocation: true
argument-hint: "[path]"
context: fork
allowed-tools: Read, Grep, Glob, Bash, Write
description: Vulnerability and licence audit for npm, pip and dotnet with an upgrade plan.
---

1. Detect: `package-lock.json`, `requirements.txt`/`pyproject.toml`, `*.csproj`.
2. Run: `npm audit --json --omit=dev`; `pip install pip-audit && pip-audit -r requirements.txt --format json`; `dotnet list package --vulnerable --include-transitive`; licences via `npx license-checker --summary` / `pip-licenses`.
3. Table: package, current, fixed-in, severity, direct/transitive, breaking?
4. Upgrade plan: safe patch/minor upgrades as one command; majors listed separately with the changelog link.
5. Flag copyleft licences (GPL/AGPL) in shipped code; note model/dataset licences for Hugging Face artefacts.
