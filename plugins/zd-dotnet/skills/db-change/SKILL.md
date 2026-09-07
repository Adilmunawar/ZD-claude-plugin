---
name: db-change
description: Draft a database change the way this team applies them — PENDING script with XACT_ABORT, guards and verification SELECTs, its ROLLBACK twin captured from OBJECT_DEFINITION, the applied-to log row and the OPEN-DECISIONS entry — without running anything.
disable-model-invocation: true
argument-hint: "<object> \"<what changes>\""
---

Given an object and a one-line change, produce (do not execute):
1. `db/PENDING_<today>_<object>_<slug>.sql` — header (what, why, rollback file, decision ref, authorization placeholder), `SET XACT_ABORT ON`, BEGIN TRY/TRAN, idempotent guards (`IF OBJECT_ID`, `IF NOT EXISTS (sys.indexes …)`), the change, verification SELECTs, COMMIT, CATCH with rethrow.
2. `db/ROLLBACK_<today>_<object>.sql` — for procs: `-- capture with: SELECT OBJECT_DEFINITION(OBJECT_ID('dbo.<object>'))` and a placeholder for the verbatim body; for tables/indexes: the DROP guarded by existence and a note on what data would be lost.
3. A row for the applied-to table in `db/README.md` (artifact, objects, applied ?, verified ?, rollback).
4. A `Dn` entry for `OPEN-DECISIONS.md` stating the change, the legacy readers checked, and the risk.
5. A list of every legacy reader of the object found by grep in the API and any REFERENCE_ procs.
Print the three files' paths and the decision text. Say clearly that nothing was run.
