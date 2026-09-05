# zd-quality

| Component | Type | Purpose |
|---|---|---|
| `code-reviewer` | agent, read-only | Structured review: verdict, blocking, should-fix, nits, tests |
| `review-standards` | skill | Merge criteria per stack and cross-cutting rules |
| `conventional-commits` | skill | Commit and branch naming |
| `/zd-quality:pr-description` | command | PR description from the diff |
| `/zd-quality:changelog` | command | CHANGELOG section from commits since last tag |
| `/zd-quality:adr` | command | Architecture decision record |
| `/zd-quality:tech-debt` | command | Measured debt audit → `docs/TECH-DEBT.md` |
