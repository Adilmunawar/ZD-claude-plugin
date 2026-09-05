---
name: oncall-handoff
disable-model-invocation: true
argument-hint: "[week]"
description: Weekly on-call hand-over: incidents, alerts, deploys, expiring credentials, quotas, risks.
---

Collect and write `docs/oncall/<week>.md`: open incidents and their status; alerts that fired (count, cause, silenced?); deploys done and planned; credentials/certificates expiring within 30 days (custom CA in the app, service-account keys, tokens); quota usage (Earth Engine, Spaces, Firestore, EAS builds); top 3 risks for next week. Ask for the platform numbers you cannot read from the repo rather than estimating.
