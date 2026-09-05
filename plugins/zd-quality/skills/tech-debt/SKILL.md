---
name: tech-debt
disable-model-invocation: true
argument-hint: "[path]"
context: fork
allowed-tools: Read, Grep, Glob, Bash, Write
description: Measured technical-debt audit into docs/TECH-DEBT.md.
---

Read-only. Measure, don't guess:
1. Duplication: near-identical files (`jscpd`-style or diff of similar names, e.g. `train.py` vs `train unoptimized.py`, `Inference.py` vs `Inference_lowRAM.py`).
2. Hardcoding: absolute paths (`C:\Users`, `/content/`), literal tokens (run `/zd-core:secrets-audit`), magic numbers outside a constants block.
3. Tests: files without any test reference; critical paths (upload, signing, payment, export) uncovered.
4. Size: files > 800 lines or functions > 150 lines; notebooks committed with outputs.
5. Dependencies: `npm outdated`, `pip list --outdated`, `dotnet list package --outdated`.
6. Dead code: unused exports (`ts-prune`/grep), scripts not referenced by README or CI, `old test.py`-style files.
Write `docs/TECH-DEBT.md`: table (item, evidence, impact, effort S/M/L, suggested owner), top 10 first, and a 30-day plan.
