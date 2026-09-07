# Security model

What the toolkit protects against, how, and what it does not cover. The controls are code (tested hooks and scripts), not instructions the model may or may not follow.

## Threats and controls

| Threat | Control | Where |
|---|---|---|
| The assistant runs a destructive command | `guard-bash` blocks `DROP`/`TRUNCATE`, `DELETE` without `WHERE`, recursive deletes of top-level or system paths, force-push, history-discarding git, `dotnet ef database drop/update`, running hand-applied DB scripts, disk formatting | zd-core hook, exit 2 |
| Prompt injection makes the assistant fetch and execute code | `guard-bash` blocks `curl \| sh`, `wget \| bash`, `irm \| iex`, `$(curl …)` execution | zd-core hook |
| Prompt injection makes the assistant leak secrets | `guard-bash` blocks printing credential files, uploading them, echoing `*TOKEN*`/`*SECRET*` variables, dumping the environment, minting new cloud keys; `guard-write` refuses credential files and credential-looking content (entropy-gated) | zd-core hooks |
| The assistant persists itself or weakens its own guardrails | `guard-write` refuses shell startup files, `authorized_keys`, git hooks, Claude Code settings, plugin caches, `hooks.json`; `guard-bash` blocks edits to the same paths and cron/scheduled-task installation | zd-core hooks; managed-settings deny list |
| A tampered plugin cache silently disables the guards | `INTEGRITY.json` (sha256 of every hook script, agent, skill and CLI file) is committed, checked in CI and required to be current at release; `/zaraat-dost:verify` and `zd-tools verify` compare the installed cache with the manifest for its version | release + security workflows, verify.js |
| A credential is committed | `secrets-audit` (tree + full history, 20+ patterns incl. entropy) on every push and weekly; `guard-write` blocks it at write time | security workflow, zd-core |
| Supply-chain compromise of a GitHub Action | Every action pinned to a 40-hex commit SHA (test-enforced; Dependabot keeps them current); least-privilege `permissions`; no `pull_request_target`; dependency review on PRs; OpenSSF Scorecard weekly; CodeQL on JS/TS and Python | workflows; structure test |
| A release asset is swapped after the fact | Build provenance attestation on every release asset (`gh attestation verify <file> --owner Adilmunawar`); SHA-256 sums attached | release workflow |
| Workflow injection in a repository the toolkit touches | `guard-write` refuses workflows using `pull_request_target` or interpolating untrusted event text | zd-core hook |
| Open Firestore rules | `guard-write` refuses `allow … if true` | zd-core hook |
| An unauthorised schema change on the live SQL Server | `guard-write` refuses change scripts without `XACT_ABORT`; `guard-bash` blocks running `APPLIED_`/`PENDING_`/`ROLLBACK_` scripts; `dotnet-reviewer` blocks migrations and second writers | zd-core, zd-dotnet |

## Not covered

- **A person who bypasses the hooks.** `/hooks` disables any hook per project; `--dangerously-skip-permissions` bypasses prompts (managed settings can forbid it). The guards constrain the assistant, not the user.
- **Model judgment.** A skill can be ignored by the model; only hooks are enforced. Anything that must be enforced is a hook.
- **Secrets already in history before adoption.** The audit finds them; rotation and purge are manual.
- **The host.** Endpoint security, OS patching and account hygiene are outside scope.

## Verifying a release or an install

```
gh attestation verify ZD-claude-plugin-<version>.zip --owner Adilmunawar
sha256sum -c SHA256SUMS.txt
zd-tools verify
```

## Reporting

See `SECURITY.md`. Rotate first, remove second, purge history third.
