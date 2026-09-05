---
name: audit
disable-model-invocation: true
context: fork
allowed-tools: Read, Grep, Glob, Bash, Write
description: Security and performance audit of the AGIS dashboard into docs/AGIS-AUDIT.md.
---

Read-only. Check and report with file:line evidence:
1. Secrets: `/zd-core:secrets-audit`; any `FALLBACK_*` credential objects; `NEXT_PUBLIC_` prefixes on server secrets.
2. Firestore: `firestore.rules` covers every collection written in `src/firebase/services`; validation matches `gis-schema.ts`; no rule allows unauthenticated reads.
3. API routes: input validation present; geometry size caps; error responses don't leak stack traces; timeouts considered.
4. Client: large libraries imported at page level (Monaco, xlsx, html2canvas) → dynamic import; map components `ssr:false`; images optimised.
5. Workers: main-thread loops over features > 10k; Pyodide loaded more than once.
6. GEE: reductions without `tileScale`; `getInfo` on collections; tile URLs persisted.
7. Backend: job state only in memory; missing `/health`; unbounded thread pool.
Write `docs/AGIS-AUDIT.md` with a table (issue, severity, effort, fix) and the top 5 first.
