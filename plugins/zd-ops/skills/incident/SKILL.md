---
name: incident
disable-model-invocation: true
argument-hint: "<one-line summary>"
description: Run an incident: severity, roles, reversible mitigation per service, status updates, evidence, hand-off to postmortem.
---

1. **Severity**: S1 farmers/clients cannot use a service or data exposed; S2 degraded; S3 cosmetic. Say it explicitly.
2. **Roles**: incident lead, comms, fixer. If one person, say so.
3. **Mitigate first** (from `deploy-profiles`): roll back the last deploy; disable the failing tool page; scale the Space or restart; revoke the leaked credential; put the API behind maintenance mode. Do the reversible thing first.
4. **Status update** every 30 min: what is affected, what we know, next update time — write it to `docs/incidents/<date>-<slug>.md` as you go.
5. **Evidence**: logs, error rates, the deploy that changed, the query that is slow — attach to the doc; never paste secrets or PII.
6. **Resolve**: verify with the health checks and one real request; announce.
7. Hand off to `/zd-ops:postmortem` within 48 hours.
