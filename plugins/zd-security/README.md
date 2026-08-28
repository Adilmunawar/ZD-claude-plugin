# zd-security

| Component | Type | Purpose |
|---|---|---|
| `security-reviewer` | agent, read-only | Ranked findings with evidence and fixes |
| `security-review` | skill | Checklist: auth, authorisation, validation, secrets, PII, dependencies, infra |
| `/zd-security:dependency-audit` | command | npm / pip / dotnet vulnerability and licence audit |
| `/zd-security:harden-repo` | command | Apply SECURITY.md, Dependabot, secrets-scan workflow, CODEOWNERS, .gitignore |
| `templates/` | files | The baseline files applied by `harden-repo` |

Depends on zd-core for the audit engine.
