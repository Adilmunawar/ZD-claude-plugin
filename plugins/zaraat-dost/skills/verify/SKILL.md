---
name: verify
description: Verify the installed toolkit against the release integrity manifest — every hook script, agent and skill hashed and compared — to detect tampering or accidental edits.
disable-model-invocation: true
effort: low
---

Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/verify.js"` and show the output. If any file is MODIFIED, MISSING or UNEXPECTED, say plainly that the guardrails may not be what the release shipped, recommend `claude plugin marketplace update zaraatdost` followed by `/zaraat-dost:upgrade`, and do not attempt to repair files yourself.
