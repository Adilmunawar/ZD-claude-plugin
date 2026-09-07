# zd-dotnet

Conventions for the .NET dashboard/API products (minimal-API feature slices over a live SQL Server, Next.js frontend, WinSW deployment). Built from the team's own ledgers; it tells Claude to append to them, not replace them. Depends on zd-core.

| Component | Type | Purpose |
|---|---|---|
| `dotnet-engineer` | agent | Build and fix slices, pages, gateway, deployment — under the non-negotiables |
| `dotnet-reviewer` | agent, read-only | Blocks migrations, second writers, hand-written units, unlogged changes, packaged secrets |
| `slice-conventions` | skill | Feature-slice layout, scoping, rate limits, uploads, tests, frontend route rules |
| `schema-posture` | skill | Additive hand-run scripts, XACT_ABORT, ROLLBACK twins, applied-to log, authorization |
| `legacy-parity` | skill | Reproduce first, reconcile, record, fix under a decision; units and known traps |
| `winsw-deploy` | skill | Package → update → health check → rollback on the existing host |
| `/zd-dotnet:db-change` | command | Draft PENDING + ROLLBACK + log row + decision entry (never runs) |
| `/zd-dotnet:reconcile` | command | Rows × fields diff against legacy, written into CONVERSION.md |
| `/zd-dotnet:contract-check` | command | Mobile client types vs API DTOs, both directions |

Guard hook (zd-core): writing a `db/APPLIED_*.sql` or `PENDING_*.sql` without `SET XACT_ABORT ON`, or containing a migration call in .NET startup, is blocked.
