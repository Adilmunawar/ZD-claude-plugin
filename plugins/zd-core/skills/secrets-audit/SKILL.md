---
name: secrets-audit
disable-model-invocation: true
argument-hint: "[path] [--history]"
description: Find credentials in the working tree and git history (keys, tokens, connection strings); walk through rotation and history purge.
---

1. Run `node "${CLAUDE_PLUGIN_ROOT}/scripts/secrets-audit.js" . --history` from the repo root. Show the output.
2. For every finding, state in one line: what it is, what it can access, and the rotation URL:
   - Google service-account key → GCP Console → IAM → Service Accounts → Keys: delete, create new; update `EE_BASE64_KEY` / `GEE_KEY_FILE` where deployed.
   - Hugging Face token → huggingface.co → Settings → Access Tokens → revoke; recreate with the narrowest role.
   - GitHub token → github.com → Settings → Developer settings → revoke.
   - AWS key → IAM → Users → Security credentials → deactivate, then delete.
   - Firebase/Google API key → GCP Console → APIs & Services → Credentials → regenerate and restrict.
3. Removal order: rotate first, then remove from the tree, then purge history (`git filter-repo --path <file> --invert-paths`, or recreate the repository), then force-push with the team informed. Never suggest deleting the file as the fix.
4. Add the file patterns to `.gitignore` and confirm `guard-write` is active (`/hooks`).
5. Finish with a table: finding → rotated (y/n) → removed from tree (y/n) → purged from history (y/n).
