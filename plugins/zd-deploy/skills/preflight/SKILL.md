---
name: preflight
disable-model-invocation: true
argument-hint: "<service>"
description: Pre-deployment checklist: build, tests, env vars by name, secrets audit, migrations, health, rollback, approval.
---

Report each as PASS/FAIL/N/A:
1. Target identified from `deploy-profiles`; git is clean and on the release commit; version/tag set.
2. Build + typecheck + tests green locally (`npm run build`/`dotnet build`/`pytest`).
3. `/zd-core:secrets-audit` clean; no `NEXT_PUBLIC_` on server secrets.
4. Every env var the code reads exists at the target (list names; compare with `grep -o "process.env.[A-Z_]*"` / `Configuration["..."]` / `os.environ`).
5. Database migrations reviewed; additive-only or coordinated; backup taken.
6. Health endpoint and one smoke request scripted for post-deploy.
7. Rollback command written in the deploy note.
8. Explicit approval from the user recorded in the conversation before the production step.
