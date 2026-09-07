---
name: schema-posture
description: How database changes are made against the live SQL Server — never migrations; hand-run additive scripts with XACT_ABORT, verification SELECTs, a byte-verbatim ROLLBACK twin, an applied-to log and owner authorization. Apply to any SQL, DDL, index, proc or data change.
paths: ["**/db/**", "**/*.sql", "**/CONVERSION.md", "**/DECISIONS.md", "**/OPEN-DECISIONS.md"]
---

# Schema posture (the database is the contract)

The production database is live under the surveyor mobile apps. The old API still reads and writes it. Therefore:

- **No migrations, no seeding, no startup DDL — ever.** The one exception pattern is a web-owned table provisioned by an idempotent `IF OBJECT_ID … CREATE` on an upload path (never startup, never a legacy table), and it must still be logged.
- **Additive only.** New tables (`ZD_*` prefix, web-owned), new indexes (`IX_Web_*`, `ONLINE = ON`, PAGE-compressed, guarded so re-running is safe), altered procs. Never drop or rename what the legacy stack reads.
- **Every script**: `SET XACT_ABORT ON` + TRY/CATCH, a header stating what/why/rollback/authorization, verification SELECTs at the end, idempotent guards.
- **Naming**: `PENDING_<date>_<object>_<what>.sql` (ruled, not run) → rename to `APPLIED_…` the moment it lands; `ROLLBACK_<date>_<object>.sql` holds the object's definition **as it was immediately before**, captured verbatim from `OBJECT_DEFINITION`; `REFERENCE_<object>.sql` is a read-only copy of a prod-only object, never run.
- **Applied-to log** in `db/README.md`: artifact, objects, applied date, verified-live date and evidence (row counts, timings), rollback. Observation, not intention.
- **Authorization**: a change needs an owner ruling in `OPEN-DECISIONS.md` (Dn) before it is run; quote it in the script header.
- Recovery model, log size and shrink are owner-ruled; never touch them.
- Development runs against a restored testing copy; tests run on SQLite and cannot reach a server.

Checklist before proposing a script: object exists? readers of that object in the legacy stack? additive? guarded? rollback captured? verification SELECTs? decision reference? log row drafted?
