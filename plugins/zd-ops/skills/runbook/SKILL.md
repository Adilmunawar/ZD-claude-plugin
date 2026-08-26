---
name: runbook
disable-model-invocation: true
argument-hint: "<service>"
description: Service runbook with verified commands: health, restart, rollback, secrets rotation, scaling, escalation.
---

For the named service, using `deploy-profiles` and the repo: **Purpose and owners** · **Endpoints and health checks** (URLs, expected responses) · **Dashboards and logs** (where, what to look for) · **Common alarms and first actions** (table) · **Restart / redeploy / rollback** (exact commands) · **Secrets rotation** (which, where set, how to verify) · **Scaling and limits** (instances, memory, quotas: Earth Engine, Spaces, Firestore) · **Known failure modes** · **Escalation**. Verify every command exists in the repo or platform CLI before writing it.
