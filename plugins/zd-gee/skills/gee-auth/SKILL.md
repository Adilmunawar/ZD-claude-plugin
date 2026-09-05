---
name: gee-auth
description: Earth Engine authentication patterns (service account via env, interactive, project id) and common auth errors.
---

- Servers/Colab: service-account JSON (`gee.json`) referenced by env var `GEE_KEY_FILE`; `ee.ServiceAccountCredentials(email, key_file)` → `ee.Initialize(creds, project=PROJECT)`. Never commit or print the file (zd-core hooks refuse to write it).
- Laptops: `ee.Authenticate()` once, then `ee.Initialize(project=...)`. `project` is mandatory on new accounts.
- Errors: `PERMISSION_DENIED` → service account not added to the project / EE not enabled; `Not signed up` → account needs EE registration; `quota exceeded` → add `ee.data.setDeadline` and reduce concurrent tasks.
- Put the init in one `gee_init()` helper used by every script; test with `ee.Number(1).getInfo()`.
